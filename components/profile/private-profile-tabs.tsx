'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BurgerMatchSection from '@/components/profile/burger-match-section'
import FollowersSection from '@/components/profile/followers-section'
import DiscoverUsers from '@/components/profile/discover-users'
import UserActivityFeed from '@/components/profile/user-activity-feed'

interface PrivateProfileTabsProps {
  userId: string
  currentUserId: string
}

export default function PrivateProfileTabs({ userId, currentUserId }: PrivateProfileTabsProps) {
  const [followChangeKey, setFollowChangeKey] = useState(0)

  const handleFollowChange = () => {
    setFollowChangeKey((prev) => prev + 1)
  }

  return (
    <Tabs defaultValue="match" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 mb-6">
        <TabsTrigger value="match" className="data-[state=active]:bg-amber-100">
          🎮 Match
        </TabsTrigger>
        <TabsTrigger value="followers" className="data-[state=active]:bg-amber-100">
          👥 Social
        </TabsTrigger>
        <TabsTrigger value="discover" className="data-[state=active]:bg-amber-100">
          🎯 Descubrir
        </TabsTrigger>
        <TabsTrigger value="activity" className="data-[state=active]:bg-amber-100">
          📰 Feed
        </TabsTrigger>
      </TabsList>

      {/* Burger Match Tab */}
      <TabsContent value="match" className="bg-white rounded-lg border border-gray-200 p-6">
        <BurgerMatchSection userId={userId} />
      </TabsContent>

      {/* Followers Tab */}
      <TabsContent value="followers" className="bg-white rounded-lg border border-gray-200 p-6">
        <FollowersSection
          key={followChangeKey}
          userId={userId}
          currentUserId={currentUserId}
        />
      </TabsContent>

      {/* Discover Users Tab */}
      <TabsContent value="discover" className="bg-white rounded-lg border border-gray-200 p-6">
        <DiscoverUsers userId={userId} onFollowChange={handleFollowChange} />
      </TabsContent>

      {/* Activity Feed Tab */}
      <TabsContent value="activity" className="bg-white rounded-lg border border-gray-200 p-6">
        <UserActivityFeed userId={userId} followingOnly={true} />
      </TabsContent>
    </Tabs>
  )
}

/*
  INTEGRACIÓN EN TU PÁGINA DE PERFIL PRIVADO
  ==========================================

  En: app/(main)/profile/page.tsx (o donde tengas el perfil del usuario actual)

  ```tsx
  'use client'

  import PrivateProfileTabs from '@/components/profile/private-profile-tabs'
  
  export default function ProfilePage() {
    const userId = useAuth().user.id
    const currentUserId = useAuth().user.id // mismo usuario
    
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PrivateProfileTabs userId={userId} currentUserId={currentUserId} />
      </main>
    )
  }
  ```

  ESTRUCTURA RECOMENDADA:
  
  /app/(main)/profile/
  ├── page.tsx (Perfil privado del usuario - para auth users)
  ├── [username]/
  │   └── page.tsx (Perfil público - para cualquier usuario)
  └── edit/
      └── page.tsx (Editar perfil - solo para el propietario)

  TABS DISPONIBLES:
  ================

  1. 🎮 MATCH - Burger Match minigame
     - BurgerMatchSection (contiene todo)
     - Estadísticas, juego, feedback

  2. 👥 SOCIAL - Followers/Following
     - FollowersSection (tabs internos)
     - Búsqueda de usuarios
     - Botones de seguimiento

  3. 🎯 DESCUBRIR - Sugerencias
     - DiscoverUsers (carrusel)
     - Algoritmo de recomendación
     - Botón "Ver más sugerencias"

  4. 📰 FEED - Actividad
     - UserActivityFeed (timeline)
     - Actividad de usuarios seguidos
     - Scroll infinito

  PROPS IMPORTANTES:
  =================

  userId: string
    - El ID del usuario propietario del perfil
    - Para funciones de juego y actividad personal

  currentUserId: string
    - El ID del usuario autenticado actual
    - Para determinar si puede seguir/deseguir
    - Generalmente igual a userId en perfil privado
    - Diferente en perfiles públicos

  onFollowChange: () => void (callback)
    - Se ejecuta cuando el usuario sigue/desigue a alguien
    - Útil para actualizar listas (se incluye como prop)

  FLUJO DE AUTENTICACIÓN:
  ======================

  // En una página/componente de perfil privado
  import { useAuth } from '@/hooks/useAuth'
  import { useRouter } from 'next/navigation'

  export default function ProfilePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading) return <LoadingSpinner />
    if (!user) {
      router.push('/auth/login')
      return null
    }

    return (
      <PrivateProfileTabs
        userId={user.id}
        currentUserId={user.id}
      />
    )
  }
*/
