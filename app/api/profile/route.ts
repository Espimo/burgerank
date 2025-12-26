import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Obtener usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    // Obtener badges del usuario
    const { data: userBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        unlocked_at,
        badges(id, name, description, emoji, requirement_type, requirement_value)
      `)
      .eq('user_id', user.id);

    if (badgesError) throw badgesError;

    // Obtener todos los badges disponibles
    const { data: allBadges } = await supabase
      .from('badges')
      .select('*');

    // Obtener estadísticas del usuario
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('ratings')
      .select(`
        id,
        overall_rating,
        points_awarded,
        created_at,
        burger_id,
        burgers(id, name, city_id)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ratingsError) throw ratingsError;

    // Calcular estadísticas
    const totalRatings = ratingsData?.length || 0;
    const totalPoints = ratingsData?.reduce((sum, r) => sum + (r.points_awarded || 0), 0) || 0;
    const avgRating = totalRatings > 0
      ? (ratingsData?.reduce((sum, r) => sum + r.overall_rating, 0) || 0) / totalRatings
      : 0;

    // Ciudades únicas visitadas
    const citiesVisited = new Set(ratingsData?.map(r => (r.burgers as any)?.city_id).filter(Boolean)).size;

    // Top 3 del usuario (mejores valoraciones)
    const top3 = [...(ratingsData || [])]
      .sort((a, b) => b.overall_rating - a.overall_rating)
      .slice(0, 3)
      .map(r => ({
        name: (r.burgers as any)?.name || 'Hamburguesa',
        rating: r.overall_rating,
      }));

    // Últimas valoraciones
    const recentRatings = (ratingsData || []).slice(0, 5).map(r => ({
      name: (r.burgers as any)?.name || 'Hamburguesa',
      rating: r.overall_rating,
      created_at: r.created_at,
    }));

    // Obtener recompensas disponibles
    const { data: rewards } = await supabase
      .from('rewards')
      .select('*')
      .order('cost_points', { ascending: true });

    // Calcular progreso a la siguiente recompensa
    const nextReward = rewards?.find(r => r.cost_points > totalPoints) || null;
    const previousReward = rewards?.filter(r => r.cost_points <= totalPoints).pop() || null;

    // Formatear badges desbloqueados
    const unlockedBadges = (userBadges || []).map(ub => ({
      id: (ub.badges as any)?.id,
      name: (ub.badges as any)?.name,
      description: (ub.badges as any)?.description,
      emoji: (ub.badges as any)?.emoji,
      unlocked_at: ub.unlocked_at,
    }));

    // Badges bloqueados (todos los badges menos los desbloqueados)
    const unlockedIds = new Set(unlockedBadges.map(b => b.id));
    const lockedBadges = (allBadges || [])
      .filter(b => !unlockedIds.has(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        emoji: b.emoji,
        requirement_type: b.requirement_type,
        requirement_value: b.requirement_value,
      }));

    // Determinar categoría del usuario
    let category = 'Burger Fan';
    if (totalPoints >= 300) category = 'Burger Obsessed';
    else if (totalPoints >= 101) category = 'Burger Lover';

    return NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        public_profile: userData.public_profile,
        created_at: userData.created_at,
      },
      stats: {
        points: totalPoints,
        totalRatings,
        avgRating: parseFloat(avgRating.toFixed(2)),
        citiesVisited,
        category,
      },
      badges: {
        unlocked: unlockedBadges,
        locked: lockedBadges,
        totalUnlocked: unlockedBadges.length,
        totalAvailable: (allBadges || []).length,
      },
      top3,
      recentRatings,
      rewards: {
        available: rewards || [],
        next: nextReward,
        previous: previousReward,
        progress: nextReward
          ? Math.round((totalPoints / nextReward.cost_points) * 100)
          : 100,
        pointsToNext: nextReward
          ? nextReward.cost_points - totalPoints
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    const message = error instanceof Error ? error.message : 'Error al obtener perfil';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Obtener usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, public_profile, avatar_url } = body;

    // Actualizar usuario
    const { data, error } = await (supabase
      .from('users')
      .update as any)({
        username: username || undefined,
        bio: bio || undefined,
        public_profile: public_profile !== undefined ? public_profile : undefined,
        avatar_url: avatar_url || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    const message = error instanceof Error ? error.message : 'Error al actualizar perfil';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
