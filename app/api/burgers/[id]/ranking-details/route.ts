import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Llamar a la función de PostgreSQL que devuelve los detalles del ranking
    const { data: rankingDetails, error: rpcError } = await supabase
      .rpc('get_burger_ranking_details', { p_burger_id: id });

    if (rpcError) {
      // Si la función RPC no existe, obtener datos manualmente
      console.warn('RPC not available, fetching manually:', rpcError);
      
      // Obtener datos de la burger
      const { data: burger, error: burgerError } = await supabase
        .from('burgers')
        .select(`
          id,
          name,
          description,
          type,
          price,
          image_url,
          ranking_position,
          ranking_score,
          bayesian_score,
          wilson_score,
          average_rating,
          total_reviews,
          verified_reviews_count,
          positive_reviews_count,
          standard_deviation,
          last_review_date,
          is_in_ranking,
          flagged_for_review,
          created_at,
          restaurant:restaurants(
            id,
            name,
            address,
            city:cities(id, name)
          )
        `)
        .eq('id', id)
        .single();

      if (burgerError || !burger) {
        return NextResponse.json(
          { error: 'Burger no encontrada' },
          { status: 404 }
        );
      }

      // Obtener distribución de ratings
      const { data: ratings } = await supabase
        .from('ratings')
        .select('overall_rating, is_verified, has_photo, has_ticket, created_at')
        .eq('burger_id', id)
        .eq('is_suspicious', false);

      const distribution = {
        five_stars: 0,
        four_stars: 0,
        three_stars: 0,
        two_stars: 0,
        one_star: 0,
      };

      let verifiedCount = 0;
      let photoCount = 0;
      let ticketCount = 0;
      let recentCount = 0; // últimos 30 días

      if (ratings) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        ratings.forEach(r => {
          if (r.overall_rating === 5) distribution.five_stars++;
          else if (r.overall_rating >= 4) distribution.four_stars++;
          else if (r.overall_rating >= 3) distribution.three_stars++;
          else if (r.overall_rating >= 2) distribution.two_stars++;
          else distribution.one_star++;

          if (r.is_verified) verifiedCount++;
          if (r.has_photo) photoCount++;
          if (r.has_ticket) ticketCount++;
          if (new Date(r.created_at) > thirtyDaysAgo) recentCount++;
        });
      }

      // Calcular factores manualmente (aproximación)
      const totalReviews = burger.total_reviews || 0;
      const verificationFactor = totalReviews > 0
        ? 1 + (verifiedCount / totalReviews) * 0.15
        : 1.0;
      
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(burger.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      const noveltyBoost = daysSinceCreation <= 30 ? 1.1 : 1.0;
      
      const stdDev = burger.standard_deviation || 0;
      const variancePenalty = stdDev < 0.5 ? 1.0 : stdDev <= 1.0 ? 0.95 : 0.85;

      // Obtener historial de posiciones (últimos 30 días)
      const { data: history } = await supabase
        .from('ranking_history')
        .select('ranking_position, ranking_score, recorded_at')
        .eq('burger_id', id)
        .order('recorded_at', { ascending: false })
        .limit(30);

      return NextResponse.json({
        burger_id: burger.id,
        burger_name: burger.name,
        restaurant: burger.restaurant,
        ranking_position: burger.ranking_position,
        ranking_score: burger.ranking_score,
        is_in_ranking: burger.is_in_ranking,
        scores: {
          bayesian_score: burger.bayesian_score,
          wilson_score: burger.wilson_score,
          average_rating: burger.average_rating,
        },
        factors: {
          verification_factor: parseFloat(verificationFactor.toFixed(4)),
          user_factor: 1.0, // Requiere cálculo más complejo
          recency_factor: recentCount > totalReviews * 0.3 ? 1.05 : 1.0,
          variance_penalty: variancePenalty,
          novelty_boost: noveltyBoost,
        },
        stats: {
          total_reviews: totalReviews,
          verified_reviews: burger.verified_reviews_count,
          positive_reviews: burger.positive_reviews_count,
          photo_reviews: photoCount,
          ticket_reviews: ticketCount,
          recent_reviews: recentCount,
          standard_deviation: stdDev,
          last_review_date: burger.last_review_date,
          verified_percentage: totalReviews > 0
            ? Math.round((burger.verified_reviews_count / totalReviews) * 100)
            : 0,
        },
        rating_distribution: distribution,
        history: history || [],
        flagged_for_review: burger.flagged_for_review,
        created_at: burger.created_at,
      });
    }

    // Si la función RPC existe, devolver sus resultados
    return NextResponse.json(rankingDetails);

  } catch (error) {
    console.error('Error fetching ranking details:', error);
    return NextResponse.json(
      { error: 'Error al obtener detalles del ranking' },
      { status: 500 }
    );
  }
}
