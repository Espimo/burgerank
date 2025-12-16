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
      .select('id')
      .eq('user_id', user.id)
      .eq('burger_id', validated.burger_id)
      .single();

    if (existingRating) {
      return NextResponse.json(
        { error: 'Ya has valorado esta burger' },
        { status: 400 }
      );
    }

    // Calcular puntos: base 1 + bonificación
    let points = 1;
    if (validated.overall_rating === 5) points += 5;
    if (validated.overall_rating === 4) points += 3;

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
        has_ticket: validated.has_ticket || false,
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

    // Actualizar puntos del usuario
    const { data: userData } = await supabase
      .from('users')
      .select('points')
      .eq('id', user.id)
      .single();

    const newPoints = ((userData as any)?.points || 0) + points;

    const { error: updateUserError } = await (supabase
      .from('users')
      .update as any)({ points: newPoints })
      .eq('id', user.id);

    if (updateUserError) throw updateUserError;

    // Verificar y otorgar badges
    // TODO: Implementar lógica de badges

    // Crear notificación
    await (supabase.from('notifications').insert as any)({
      user_id: user.id,
      title: '🌟 Rating guardado',
      description: `Tu valoración de la burger fue guardada. +${points} puntos`,
      type: 'rating_saved',
      icon_emoji: '✅',
    });

    return NextResponse.json({
      success: true,
      rating,
      pointsEarned: points,
      newTotal: newPoints,
      message: `Valoración guardada. +${points} puntos`,
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
