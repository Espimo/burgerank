'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  type: 'badge' | 'rating' | 'level' | 'achievement' | 'system';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  metadata?: {
    badge_id?: string;
    badge_emoji?: string;
    points?: number;
    level?: number;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function NotificationPanel({ isOpen, onClose, userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId && isOpen) {
      loadNotifications();
    }
  }, [userId, isOpen]);

  const loadNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    const supabase = createClient() as any;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && !error) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;
    
    const supabase = createClient() as any;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    const supabase = createClient() as any;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge': return '🏆';
      case 'rating': return '⭐';
      case 'level': return '🚀';
      case 'achievement': return '🎯';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'badge': return '#f59e0b';
      case 'rating': return '#fbbf24';
      case 'level': return '#10b981';
      case 'achievement': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#1f2937',
          height: '100%',
          overflowY: 'auto',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: '#1f2937',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Notificaciones
            </h2>
            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #374151' }}>
            <button
              onClick={markAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#fbbf24',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ✓ Marcar todas como leídas
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div style={{ padding: '0.5rem 0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔕</div>
              <p>No tienes notificaciones</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Aquí aparecerán tus logros, nuevas insignias y más
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid #374151',
                  backgroundColor: notification.is_read ? 'transparent' : 'rgba(251, 191, 36, 0.05)',
                  cursor: notification.is_read ? 'default' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${getNotificationColor(notification.type)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    {notification.metadata?.badge_emoji || getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <h4
                        style={{
                          color: notification.is_read ? '#d1d5db' : '#fff',
                          fontWeight: notification.is_read ? '500' : '600',
                          fontSize: '0.95rem',
                          margin: 0,
                        }}
                      >
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#fbbf24',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        color: '#9ca3af',
                        fontSize: '0.85rem',
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {notification.message}
                    </p>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// NotificationBadge component for TopBar
export function NotificationBadge({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        fontSize: '1.25rem',
      }}
    >
      🔔
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '0.65rem',
            minWidth: '16px',
            height: '16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
          }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
