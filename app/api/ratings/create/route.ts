import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ratingSchema = z.object({
  burger_id: z.string().uuid(),
  overall_rating: z.number().int().min(1).max(5),
  pan_rating: z.number().int().min(1).max(3).optional(),
  carne_rating: z.number().int().min(1).max(3).optional(),
  toppings_rating: z.number().int().min(1).max(3).optional(),
  salsa_rating: z.number().int().min(1).max(3).optional(),
  price: z.number().positive().optional(),
  comment: z.string().max(1000).optional(),
  consumption_type: z.enum(['local', 'delivery']).optional(),
  appetizers: z.array(z.string()).optional(),
  has_ticket: z.boolean().optional(),
  ticket_url: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('No autenticado');

    // Parsear y validar datos
    const body = await request.json();
    const validated = ratingSchema.parse(body);

    // Verificar si ya valoró esta burger
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, appetizers, has_ticket, ticket_url, points_awarded')
      .eq('user_id', user.id)
      .eq('burger_id', validated.burger_id)
      .single();

    if (existingRating) {
      // Devolver la valoración existente para permitir edición
      return NextResponse.json(
        { 
          error: 'Ya has valorado esta burger',
          existingRating: existingRating,
          canEdit: true
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Calcular puntos: SOLO si hay ticket
    // Si has_ticket = true: base 1 + bonificación por rating
    // Si has_ticket = false: 0 puntos
    let points = 0;
    const hasTicket = validated.has_ticket || false;
    
    if (hasTicket) {
      points = 1; // Base point
      if (validated.overall_rating === 5) points += 5;
      else if (validated.overall_rating === 4) points += 3;
      else if (validated.overall_rating === 3) points += 1;
    }

    // Insertar rating
    const { data: rating, error: ratingError } = await (supabase
      .from('ratings')
      .insert as any)({
        user_id: user.id,
        burger_id: validated.burger_id,
        overall_rating: validated.overall_rating,
        pan_rating: validated.pan_rating,
        carne_rating: validated.carne_rating,
        toppings_rating: validated.toppings_rating,
        salsa_rating: validated.salsa_rating,
        price: validated.price,
        comment: validated.comment,
        consumption_type: validated.consumption_type,
        appetizers: validated.appetizers,
        has_ticket: hasTicket,
        ticket_url: validated.ticket_url,
        points_awarded: points,
      })
      .select()
      .single();

    if (ratingError) throw ratingError;

    // Obtener todos los ratings de esta burger para actualizar promedio
    const { data: allRatings, error: getAllError } = await supabase
      .from('ratings')
      .select('overall_rating')
      .eq('burger_id', validated.burger_id);

    if (getAllError) throw getAllError;

    // Calcular nuevo promedio
    const averageRating = (allRatings as any) && (allRatings as any).length > 0
      ? ((allRatings as any).reduce((sum: number, r: any) => sum + r.overall_rating, 0) / (allRatings as any).length)
      : 0;

    // Actualizar burger
    const { error: updateBurgerError } = await (supabase
      .from('burgers')
      .update as any)({
        average_rating: parseFloat(averageRating.toFixed(2)),
        total_ratings: (allRatings as any)?.length || 0,
      })
      .eq('id', validated.burger_id);

    if (updateBurgerError) throw updateBurgerError;

    // Actualizar puntos del usuario (solo si hay puntos que sumar)
    let newPoints = 0;
    if (points > 0) {
      const { data: userData } = await supabase
        .from('users')
        .select('points')
        .eq('id', user.id)
        .single();

      newPoints = ((userData as any)?.points || 0) + points;

      const { error: updateUserError } = await (supabase
        .from('users')
        .update as any)({ points: newPoints })
        .eq('id', user.id);

      if (updateUserError) throw updateUserError;
    } else {
      // Obtener puntos actuales sin modificar
      const { data: userData } = await supabase
        .from('users')
        .select('points')
        .eq('id', user.id)
        .single();
      newPoints = (userData as any)?.points || 0;
    }

    // Verificar y otorgar badges usando la función de PostgreSQL
    let newBadges: any[] = [];
    try {
      const { data: badgesResult, error: badgesError } = await supabase
        .rpc('check_and_unlock_badges', { p_user_id: user.id });
      
      if (!badgesError && badgesResult) {
        // Obtener badges recién desbloqueados
        const { data: allUserBadges } = await supabase
          .from('user_badges')
          .select('badge_id, unlocked_at, badges(name, emoji)')
          .eq('user_id', user.id)
          .order('unlocked_at', { ascending: false })
          .limit(3);
        
        // Filtrar badges desbloqueados en los últimos 5 segundos (nuevos)
        const recentBadges = (allUserBadges || []).filter(b => {
          const unlockedAt = new Date(b.unlocked_at);
          const now = new Date();
          return (now.getTime() - unlockedAt.getTime()) < 5000;
        });
        
        newBadges = recentBadges.map(b => ({
          name: (b.badges as any)?.name,
          emoji: (b.badges as any)?.emoji
        }));
      }
    } catch (badgeError) {
      console.error('Error checking badges:', badgeError);
      // No interrumpir el flujo si falla el check de badges
    }

    // Crear notificación
    let notificationMessage = hasTicket 
      ? `Tu valoración de la burger fue guardada. +${points} puntos`
      : `Tu valoración fue guardada. Sube ticket para ganar puntos.`;
    
    if (newBadges.length > 0) {
      notificationMessage += ` 🏅 ¡Nueva insignia: ${newBadges[0].name}!`;
    }

    await (supabase.from('notifications').insert as any)({
      user_id: user.id,
      title: hasTicket ? '🌟 Rating guardado' : '📝 Valoración guardada',
      description: notificationMessage,
      type: hasTicket ? 'rating_saved' : 'rating_no_ticket',
      icon_emoji: hasTicket ? '✅' : '📝',
    });

    return NextResponse.json({
      success: true,
      rating,
      pointsEarned: points,
      newTotal: newPoints,
      hasTicket,
      newBadges,
      message: notificationMessage,
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    const message = error instanceof Error ? error.message : 'Error al guardar valoración';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una valoración existente
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('No autenticado');

    // Parsear y validar datos
    const body = await request.json();
    console.log('PUT rating - Request body:', JSON.stringify(body, null, 2))
    
    const { rating_id, ...updateData } = body;
    console.log('PUT rating - rating_id:', rating_id, 'updateData:', updateData)
    
    const validated = ratingSchema.parse(updateData);
    console.log('PUT rating - Validated:', validated)

    if (!rating_id) {
      throw new Error('rating_id es requerido');
    }

    // Verificar que la valoración pertenece al usuario
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id, burger_id, points_awarded, has_ticket')
      .eq('id', rating_id)
      .eq('user_id', user.id)
      .single();

    if (!existingRating) {
      return NextResponse.json(
        { error: 'Valoración no encontrada' },
        { status: 404 }
      );
    }

    // Calcular nuevos puntos
    let points = 0;
    const hasTicket = validated.has_ticket || false;
    
    if (hasTicket) {
      points = 1;
      if (validated.overall_rating === 5) points += 5;
      else if (validated.overall_rating === 4) points += 3;
      else if (validated.overall_rating === 3) points += 1;
    }

    // Calcular diferencia de puntos
    const oldPoints = existingRating.points_awarded || 0;
    const pointsDiff = points - oldPoints;
    console.log('PUT rating - Points:', { oldPoints, newPoints: points, pointsDiff })

    // Actualizar rating
    console.log('PUT rating - Actualizando en DB...')
    const { data: rating, error: ratingError } = await (supabase
      .from('ratings')
      .update as any)({
        overall_rating: validated.overall_rating,
        pan_rating: validated.pan_rating,
        carne_rating: validated.carne_rating,
        toppings_rating: validated.toppings_rating,
        salsa_rating: validated.salsa_rating,
        price: validated.price,
        comment: validated.comment,
        consumption_type: validated.consumption_type,
        appetizers: validated.appetizers,
        has_ticket: hasTicket,
        ticket_url: validated.ticket_url,
        points_awarded: points,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rating_id)
      .select()
      .single();
    
    console.log('PUT rating - Update result:', { success: !ratingError, error: ratingError })

    if (ratingError) throw ratingError;

    // Recalcular promedio de la burger
    const { data: allRatings, error: getAllError } = await supabase
      .from('ratings')
      .select('overall_rating')
      .eq('burger_id', existingRating.burger_id);

    if (getAllError) throw getAllError;

    const averageRating = (allRatings as any) && (allRatings as any).length > 0
      ? ((allRatings as any).reduce((sum: number, r: any) => sum + r.overall_rating, 0) / (allRatings as any).length)
      : 0;

    await (supabase
      .from('burgers')
      .update as any)({
        average_rating: parseFloat(averageRating.toFixed(2)),
      })
      .eq('id', existingRating.burger_id);

    // Actualizar puntos del usuario
    let newPoints = 0;
    if (pointsDiff !== 0) {
      const { data: userData } = await supabase
        .from('users')
        .select('points')
        .eq('id', user.id)
        .single();

      newPoints = ((userData as any)?.points || 0) + pointsDiff;

      await (supabase
        .from('users')
        .update as any)({ points: newPoints })
        .eq('id', user.id);
    } else {
      const { data: userData } = await supabase
        .from('users')
        .select('points')
        .eq('id', user.id)
        .single();
      newPoints = (userData as any)?.points || 0;
    }

    return NextResponse.json({
      success: true,
      rating,
      pointsDiff,
      newTotal: newPoints,
      hasTicket,
      message: `Valoración actualizada. ${pointsDiff > 0 ? `+${pointsDiff}` : pointsDiff < 0 ? pointsDiff : 0} puntos`,
    });
  } catch (error) {
    console.error('Error updating rating - FULL ERROR:', error);
    const message = error instanceof Error ? error.message : 'Error al actualizar valoración';
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('Error stack:', stack);
    return NextResponse.json(
      { 
        error: message,
        details: error instanceof Error ? error.toString() : String(error)
      },
      { status: 500 }
    );
  }
}
