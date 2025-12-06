'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { BurgerSearchStep } from '@/components/rate/burger-search-step'
import { RatingForm } from '@/components/rate/rating-form'
import { RatingSuccess } from '@/components/rate/rating-success'
import { NewBurgerForm } from '@/components/rate/new-burger-form'
import { RateWizard } from '@/components/rate/rate-wizard'
import { type Burger } from '@/lib/types'
import { type ReviewFormData } from '@/lib/validations/review-schema'
import { type NewBurgerFormData } from '@/lib/validations/new-burger-schema'
import { submitReview } from '@/lib/api/submit-review'
import { submitNewBurger } from '@/lib/api/submit-burger'
import { checkDailyLimit, checkDuplicateReview } from '@/lib/api/anti-spam'

type Step = 'search' | 'rating' | 'success'

export default function RatePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('search')
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null)
  const [newBurgerDialogOpen, setNewBurgerDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{
    newPoints: number
    newLevel?: number
    unlockedBadges?: string[]
    unlockedRewards?: string[]
  } | null>(null)

  // Valida antes de avanzar al paso 2
  const handleSelectBurger = useCallback(async (burger: Burger) => {
    try {
      // Verificar límite diario
      const dailyCheck = await checkDailyLimit('')
      if (!dailyCheck.allowed) {
        alert(dailyCheck.reason)
        return
      }

      // Verificar review duplicada
      const duplicateCheck = await checkDuplicateReview('', burger.id)
      if (!duplicateCheck.allowed) {
        alert(duplicateCheck.reason)
        return
      }

      setSelectedBurger(burger)
      setStep('rating')
    } catch (error) {
      console.error('Error selecting burger:', error)
      alert('Error al seleccionar burger')
    }
  }, [])

  const handleNewBurger = useCallback(() => {
    setNewBurgerDialogOpen(true)
  }, [])

  const handleSubmitNewBurger = useCallback(
    async (data: NewBurgerFormData) => {
      try {
        setIsSubmitting(true)
        const result = await submitNewBurger(data)

        if (result.success) {
          setNewBurgerDialogOpen(false)
          alert('Burger enviada para revisión. Aparecerá en 24-48 horas')
        } else {
          alert(result.error || 'Error al enviar burger')
        }
      } catch (error) {
        console.error('Error submitting burger:', error)
        alert('Error al enviar burger')
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  const handleSubmitReview = useCallback(
    async (data: ReviewFormData) => {
      if (!selectedBurger) return

      try {
        setIsSubmitting(true)

        const result = await submitReview({
          burgerId: selectedBurger.id,
          overall_rating: data.overall_rating,
          detailed_ratings: data.detailed_ratings,
          category_tags: data.category_tags,
          experience_tags: data.experience_tags,
          comment: data.comment,
          visit_date: data.visit_date,
          images: data.images,
        })

        if (result.success) {
          setSuccessData({
            newPoints: result.newPoints || 50,
            newLevel: result.newLevel,
            unlockedBadges: result.unlockedBadges,
            unlockedRewards: result.unlockedRewards,
          })
          setStep('success')
        } else {
          alert(result.error || 'Error al publicar valoración')
        }
      } catch (error) {
        console.error('Error submitting review:', error)
        alert('Error al publicar valoración')
      } finally {
        setIsSubmitting(false)
      }
    },
    [selectedBurger]
  )

  const handleRateAnother = useCallback(() => {
    setStep('search')
    setSelectedBurger(null)
    setSuccessData(null)
  }, [])

  const handleBackToRanking = useCallback(() => {
    router.push('/app/ranking')
  }, [router])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BurgeRank',
          text: `¡Acabo de valorar una burger en BurgeRank! 🍔⭐`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Share error:', error)
      }
    }
  }, [])

  const getStepNumber = (): number => {
    if (step === 'search') return 1
    if (step === 'rating') return 2
    return 3
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col bg-background">
        {/* New burger dialog */}
        <NewBurgerForm
          open={newBurgerDialogOpen}
          onOpenChange={setNewBurgerDialogOpen}
          onSubmit={handleSubmitNewBurger}
          isSubmitting={isSubmitting}
        />

        {/* Wizard container */}
        {step !== 'success' ? (
          <RateWizard
            currentStep={getStepNumber()}
            totalSteps={3}
            stepTitles={['Burger', 'Calificación', 'Éxito']}
            canGoBack={step === 'rating'}
            canGoNext={step === 'search' && selectedBurger !== null}
            isLoading={isSubmitting}
            onPrevious={() => {
              if (step === 'rating') {
                setStep('search')
                setSelectedBurger(null)
              }
            }}
            onNext={() => {
              if (step === 'search' && selectedBurger) {
                setStep('rating')
              }
            }}
            onPublish={() => {
              // Handled in the form submission
            }}
          >
            {step === 'search' && (
              <BurgerSearchStep
                onSelectBurger={handleSelectBurger}
                onNewBurger={handleNewBurger}
              />
            )}

            {step === 'rating' && selectedBurger && (
              <RatingForm
                burger={selectedBurger}
                onSubmit={handleSubmitReview}
                isSubmitting={isSubmitting}
              />
            )}
          </RateWizard>
        ) : successData ? (
          <div className="flex-1 flex flex-col">
            <RatingSuccess
              newPoints={successData.newPoints}
              newLevel={successData.newLevel}
              unlockedBadges={successData.unlockedBadges}
              unlockedRewards={successData.unlockedRewards}
              onShareClick={handleShare}
              onRateAnother={handleRateAnother}
              onBackToRanking={handleBackToRanking}
            />
          </div>
        ) : null}
      </div>
    </MainLayout>
  )
}
