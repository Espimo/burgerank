'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNotificationsStore } from '@/lib/stores/notifications-store'
import { useBurgeRankFunctions } from '@/lib/hooks/use-burger-rank-functions'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/utils/animations'
import { Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationsStore()
  
  const { markAllRead } = useBurgeRankFunctions()

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

  const handleMarkAllRead = () => {
    markAllAsRead() // Store action
    markAllRead() // Hook function (for feedback/logging)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
            >
              Marcar todas como leídas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay notificaciones</p>
        </Card>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={staggerItemVariants}
            >
              <Card
                className={`p-4 transition-colors cursor-pointer hover:bg-accent/50
                  ${notification.read ? 'bg-background' : 'bg-accent/30'}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto py-1 px-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Marcar como leída
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
