"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Gift, Trophy, Star, Flame } from "lucide-react"

const rewards = [
  {
    id: 1,
    title: "Primer Rating",
    description: "Realiza tu primera valoración",
    icon: Star,
    points: 10,
    unlocked: true,
  },
  {
    id: 2,
    title: "Crítico Ardiente",
    description: "Realiza 10 valoraciones",
    icon: Flame,
    points: 50,
    unlocked: true,
  },
  {
    id: 3,
    title: "Maestro de Sabores",
    description: "Alcanza 100 valoraciones",
    icon: Trophy,
    points: 200,
    unlocked: false,
  },
  {
    id: 4,
    title: "Coleccionista",
    description: "Califica 50 hamburguesas diferentes",
    icon: Gift,
    points: 150,
    unlocked: false,
  },
]

export default function RewardsPage() {
  const [userPoints] = useState(60)
  const [level] = useState(1)

  const unlockedRewards = rewards.filter((r) => r.unlocked)
  const lockedRewards = rewards.filter((r) => !r.unlocked)

  return (
    <motion.div
      className="px-4 py-6 max-w-2xl mx-auto pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{userPoints}</p>
          <p className="text-xs text-muted-foreground">Puntos</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{level}</p>
          <p className="text-xs text-muted-foreground">Nivel</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{unlockedRewards.length}</p>
          <p className="text-xs text-muted-foreground">Insignias</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="unlocked" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unlocked">
            Desbloqueadas ({unlockedRewards.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Próximas ({lockedRewards.length})
          </TabsTrigger>
        </TabsList>

        {/* Unlocked Rewards */}
        <TabsContent value="unlocked" className="space-y-3 mt-6">
          {unlockedRewards.length > 0 ? (
            unlockedRewards.map((reward, index) => {
              const Icon = reward.icon
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>
                      <Badge className="bg-primary">{reward.points} pts</Badge>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aún no has desbloqueado recompensas</p>
              <p className="text-sm">¡Comienza a valorar hamburguesas!</p>
            </div>
          )}
        </TabsContent>

        {/* Locked Rewards */}
        <TabsContent value="locked" className="space-y-3 mt-6">
          {lockedRewards.length > 0 ? (
            lockedRewards.map((reward, index) => {
              const Icon = reward.icon
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>
                      <Badge variant="outline">{reward.points} pts</Badge>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>¡Felicidades! Has desbloqueado todas las recompensas</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress Bar */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Progreso al siguiente nivel</p>
          <p className="text-sm font-medium">{userPoints}/100</p>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(userPoints / 100) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
