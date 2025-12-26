import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { type, id, action } = body;

    if (!type || !id || !action) {
      return NextResponse.json(
        { error: 'Se requiere type (burger/restaurant/city), id y action (approve/reject)' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action debe ser "approve" o "reject"' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    let tableName: string;

    switch (type) {
      case 'burger':
        tableName = 'burgers';
        break;
      case 'restaurant':
        tableName = 'restaurants';
        break;
      case 'city':
        tableName = 'cities';
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo inválido. Use: burger, restaurant, o city' },
          { status: 400 }
        );
    }

    // Update the item status
    const { data, error } = await supabase
      .from(tableName)
      .update({ 
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${type}:`, error);
      return NextResponse.json(
        { error: `Error al actualizar: ${error.message}` },
        { status: 500 }
      );
    }

    // If approving a burger, give bonus points to the user who submitted it
    if (type === 'burger' && action === 'approve' && data.submitted_by) {
      const bonusPoints = 10; // Bonus points for approved burger
      
      const { data: submitter } = await supabase
        .from('users')
        .select('points')
        .eq('id', data.submitted_by)
        .single();

      if (submitter) {
        await supabase
          .from('users')
          .update({ points: (submitter.points || 0) + bonusPoints })
          .eq('id', data.submitted_by);

        // Create notification for the user
        await supabase.from('notifications').insert({
          user_id: data.submitted_by,
          title: '🎉 ¡Tu hamburguesa fue aprobada!',
          description: `Tu hamburguesa "${data.name}" ha sido aprobada y ya aparece en el ranking. +${bonusPoints} puntos bonus!`,
          type: 'burger_approved',
          icon_emoji: '🍔'
        });
      }
    }

    // If rejecting, notify the user
    if (action === 'reject' && data.submitted_by) {
      await supabase.from('notifications').insert({
        user_id: data.submitted_by,
        title: `❌ ${type === 'burger' ? 'Hamburguesa' : type === 'restaurant' ? 'Restaurante' : 'Ciudad'} no aprobada`,
        description: `Tu ${type === 'burger' ? 'hamburguesa' : type === 'restaurant' ? 'restaurante' : 'ciudad'} "${data.name}" no ha sido aprobada.`,
        type: 'item_rejected',
        icon_emoji: '😔'
      });
    }

    return NextResponse.json({
      success: true,
      message: `${type} ${action === 'approve' ? 'aprobado' : 'rechazado'} correctamente`,
      data
    });

  } catch (error) {
    console.error('Error in approve/reject:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
