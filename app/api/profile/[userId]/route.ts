import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    // Obtener usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Obtener ratings del usuario
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select(`
        *,
        burger:burgers(
          id,
          name,
          description,
          restaurant:restaurants(name),
          average_rating
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ratingsError) throw ratingsError;

    // Obtener badges del usuario
    const { data: badges, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId);

    if (badgesError) throw badgesError;

    return NextResponse.json({
      user,
      ratings: (ratings as any) || [],
      badges: (badges as any) || [],
      stats: {
        totalRatings: ratings?.length || 0,
        averageRating: ratings && ratings.length > 0 
          ? ((ratings as any).reduce((sum: number, r: any) => sum + r.overall_rating, 0) / ratings.length).toFixed(2)
          : 0,
        points: (user as any)?.points,
        category: (user as any)?.category,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    );
  }
}
