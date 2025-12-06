'use client'

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewFormData } from '@/lib/validations/review-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { StarRatingInput } from './star-rating-input'
import { SliderRatingInput } from './slider-rating-input'
import { CategoryTagsSelector } from './category-tags-selector'
import { ExperienceTagsSelector } from './experience-tags-selector'
import { CommentTextarea } from './comment-textarea'
import { PhotoUpload } from './photo-upload'
import Image from 'next/image'
import { type Burger } from '@/lib/types'
import {
  ChefHat,
  Flame,
  Smile,
  Crown,
  TrendingUp,
  Wallet,
  PieChart,
} from 'lucide-react'

interface RatingFormProps {
  burger: Burger
  onSubmit: (data: ReviewFormData) => void | Promise<void>
  isSubmitting?: boolean
}

const categoryIcons = {
  bread: ChefHat,
  meat: Flame,
  sauce: Smile,
  toppings: Crown,
  presentation: TrendingUp,
  price_value: Wallet,
  overall_experience: PieChart,
}

export const RatingForm = memo(function RatingForm({
  burger,
  onSubmit,
  isSubmitting = false,
}: RatingFormProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'detailed' | 'tags' | 'comment' | 'photos'>('overview')

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      burgerId: burger.id,
      overall_rating: 0,
      detailed_ratings: {
        bread: 0,
        meat: 0,
        sauce: 0,
        toppings: 0,
        presentation: 0,
        price_value: 0,
        overall_experience: 0,
      },
      category_tags: {
        bread: [],
        meat: [],
        sauce: [],
        toppings: [],
      },
      experience_tags: [],
      comment: '',
      visit_date: new Date(),
      images: [],
    },
  })

  const handleFormSubmit = async (data: ReviewFormData) => {
    await onSubmit(data)
  }

  const sections = [
    { id: 'overview' as const, label: 'Valoración' },
    { id: 'detailed' as const, label: 'Detallado' },
    { id: 'tags' as const, label: 'Tags' },
    { id: 'comment' as const, label: 'Comentario' },
    { id: 'photos' as const, label: 'Fotos' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Burger header */}
      <div className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {burger.image_url ? (
            <Image
              src={burger.image_url}
              alt={burger.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-muted">🍔</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold line-clamp-2">{burger.name}</h2>
          <p className="text-sm text-muted-foreground">{burger.restaurant?.name}</p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Form content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Section: Overall rating */}
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">¿Cómo fue tu experiencia?</h3>
                  <FormField
                    control={form.control}
                    name="overall_rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center py-6">
                            <StarRatingInput
                              value={field.value}
                              onChange={field.onChange}
                              size="large"
                              showValue
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  onClick={() => setActiveSection('detailed')}
                  className="w-full"
                  type="button"
                >
                  Siguiente
                </Button>
              </motion.div>
            )}

            {/* Section: Detailed ratings */}
            {activeSection === 'detailed' && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {(Object.keys(form.getValues().detailed_ratings || {}) as Array<keyof typeof categoryIcons>).map(
                  (category) => {
                    const Icon = categoryIcons[category]
                    const labels = {
                      bread: 'Pan',
                      meat: 'Carne',
                      sauce: 'Salsas',
                      toppings: 'Acompañamientos',
                      presentation: 'Presentación',
                      price_value: 'Precio/Valor',
                      overall_experience: 'Experiencia General',
                    }

                    return (
                      <FormField
                        key={category}
                        control={form.control}
                        name={`detailed_ratings.${category}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SliderRatingInput
                                label={labels[category] || category}
                                icon={Icon}
                                value={field.value || 0}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )
                  }
                )}

                <Button
                  onClick={() => setActiveSection('tags')}
                  className="w-full"
                  type="button"
                >
                  Siguiente
                </Button>
              </motion.div>
            )}

            {/* Section: Category tags */}
            {activeSection === 'tags' && (
              <motion.div
                key="tags"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {(['bread', 'meat', 'sauce', 'toppings'] as const).map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`category_tags.${category}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CategoryTagsSelector
                            category={category}
                            selected={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="experience_tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ExperienceTagsSelector selected={field.value || []} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => setActiveSection('comment')}
                  className="w-full"
                  type="button"
                >
                  Siguiente
                </Button>
              </motion.div>
            )}

            {/* Section: Comment */}
            {activeSection === 'comment' && (
              <motion.div
                key="comment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CommentTextarea value={field.value || ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => setActiveSection('photos')}
                  className="w-full"
                  type="button"
                >
                  Siguiente
                </Button>
              </motion.div>
            )}

            {/* Section: Photos */}
            {activeSection === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhotoUpload images={field.value || []} onImagesChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setActiveSection('comment')}
                    variant="outline"
                    className="flex-1"
                    type="button"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Valoración'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </motion.div>
  )
})
