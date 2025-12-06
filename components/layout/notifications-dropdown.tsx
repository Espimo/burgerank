'use client'

import React from 'react'
import { Bell, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useNotificationsStore } from '@/lib/stores/notifications-store'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationsStore()

  const displayNotifications = notifications.slice(0, 10)

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      new_burger: '🍔',
      level_up: '⬆️',
      new_reward: '🎁',
      new_follower: '👥',
      comment_on_review: '💬',
    }
    return icons[type] || '📢'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-full">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 bg-background border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-0 px-2"
              onClick={markAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {displayNotifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          <div className="divide-y">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 transition-colors ${
                  notification.read
                    ? 'bg-background'
                    : 'bg-accent/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 flex-shrink-0"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-auto py-1 mt-2"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {displayNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-xs h-9"
                asChild
              >
                <Link href="/notifications">Ver todas las notificaciones</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
