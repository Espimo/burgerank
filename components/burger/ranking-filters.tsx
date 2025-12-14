'use client'

import { useCallback, useState } from 'react'
import { useFilters } from '@/lib/hooks/use-filters'
import { useBurgeRankFunctions } from '@/lib/hooks/use-burger-rank-functions'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { SecondaryFiltersModal } from './secondary-filters-modal'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PrimaryFilter {
  id: string
  label: string
  value: string
}

const PRIMARY_FILTERS: PrimaryFilter[] = [
  { id: 'todos', label: 'Todos', value: 'all' },
  { id: 'trending', label: '🔥 Tendencias', value: 'trending' },
  { id: 'new', label: '✨ Nuevas', value: 'new' },
]

const CITY_OPTIONS = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga']
const PAN_OPTIONS = ['Sésamo', 'Brioche', 'Mantequilla', 'Sin gluten']
const CARNE_OPTIONS = ['Ternera', 'Pollo', 'Smash', 'Pescado', 'Vegana']
const SALSA_OPTIONS = ['BBQ', 'Ketchup', 'Mostaza', 'Mayo', 'Sriracha']
const TOPPINGS_OPTIONS = ['Bacon', 'Queso', 'Cebolla', 'Lechuga', 'Tomate']
const PRECIO_OPTIONS = ['0-10€', '10-20€', '20-30€']
const ALERGENOS_OPTIONS = ['Sin gluten', 'Sin frutos secos', 'Vegetariano', 'Sin lácteos', 'Sin marisco']

export function RankingFilters() {
  const { filters, setFilter } = useFilters()
  const { switchRankingView } = useBurgeRankFunctions()
  const [showSecondary, setShowSecondary] = useState(false)
  
  // Modal states
  const [showCityModal, setShowCityModal] = useState(false)
  const [showPanModal, setShowPanModal] = useState(false)
  const [showCarneModal, setShowCarneModal] = useState(false)
  const [showSalsaModal, setShowSalsaModal] = useState(false)
  const [showToppingsModal, setShowToppingsModal] = useState(false)
  const [showPrecioModal, setShowPrecioModal] = useState(false)
  const [showAlergensModal, setShowAlergensModal] = useState(false)
  
  // Selected filters
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedPan, setSelectedPan] = useState<string | null>(null)
  const [selectedCarne, setSelectedCarne] = useState<string | null>(null)
  const [selectedSalsa, setSelectedSalsa] = useState<string | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<string | null>(null)
  const [selectedPrecio, setSelectedPrecio] = useState<string | null>(null)
  const [selectedAlergens, setSelectedAlergens] = useState<string[]>([])

  const handlePrimaryFilterChange = useCallback(
    (filterId: string) => {
      switchRankingView(filterId as 'all' | 'trending' | 'new')
    },
    [switchRankingView]
  )

  const activeFilterCount =
    (selectedCity ? 1 : 0) +
    (selectedPan ? 1 : 0) +
    (selectedCarne ? 1 : 0) +
    (selectedSalsa ? 1 : 0) +
    (selectedToppings ? 1 : 0) +
    (selectedPrecio ? 1 : 0) +
    (selectedAlergens.length > 0 ? 1 : 0)

  return (
    <>
      <div className="sticky top-[56px] z-40 bg-background border-b border-border">
        {/* Primary Filters (View buttons) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3 border-b border-border">
          {PRIMARY_FILTERS.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => handlePrimaryFilterChange(filter.id)}
              className="relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`relative z-10 ${
                  filter.value === 'all'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
              </span>
              {filter.value === 'all' && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Secondary Filters (Dropdowns) */}
        <div className="overflow-x-auto scrollbar-hide px-4 py-3">
          <div className="flex gap-2 min-w-max">
            {/* City Filter */}
            <button
              onClick={() => setShowCityModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCity
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              📍 {selectedCity || 'Ciudad'}
            </button>

            {/* Pan Filter */}
            <button
              onClick={() => setShowPanModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedPan
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              🥖 {selectedPan || 'Pan'}
            </button>

            {/* Carne Filter */}
            <button
              onClick={() => setShowCarneModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCarne
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              🥩 {selectedCarne || 'Carne'}
            </button>

            {/* Salsa Filter */}
            <button
              onClick={() => setShowSalsaModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedSalsa
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              🍯 {selectedSalsa || 'Salsa'}
            </button>

            {/* Toppings Filter */}
            <button
              onClick={() => setShowToppingsModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedToppings
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              🥗 {selectedToppings || 'Toppings'}
            </button>

            {/* Precio Filter */}
            <button
              onClick={() => setShowPrecioModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedPrecio
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              💰 {selectedPrecio || 'Precio'}
            </button>

            {/* Alergenos Filter */}
            <button
              onClick={() => setShowAlergensModal(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedAlergens.length > 0
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80'
              }`}
            >
              ⚠️ Alergenos {selectedAlergens.length > 0 && `(${selectedAlergens.length})`}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecondary(true)}
              className="ml-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* City Modal */}
      <Dialog open={showCityModal} onOpenChange={setShowCityModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>📍 Seleccionar Ciudad</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {CITY_OPTIONS.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city)
                  setShowCityModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCity === city
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pan Modal */}
      <Dialog open={showPanModal} onOpenChange={setShowPanModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>🥖 Seleccionar Pan</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {PAN_OPTIONS.map((pan) => (
              <button
                key={pan}
                onClick={() => {
                  setSelectedPan(pan)
                  setShowPanModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPan === pan
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {pan}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Carne Modal */}
      <Dialog open={showCarneModal} onOpenChange={setShowCarneModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>🥩 Seleccionar Carne</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {CARNE_OPTIONS.map((carne) => (
              <button
                key={carne}
                onClick={() => {
                  setSelectedCarne(carne)
                  setShowCarneModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCarne === carne
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {carne}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Salsa Modal */}
      <Dialog open={showSalsaModal} onOpenChange={setShowSalsaModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>🍯 Seleccionar Salsa</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {SALSA_OPTIONS.map((salsa) => (
              <button
                key={salsa}
                onClick={() => {
                  setSelectedSalsa(salsa)
                  setShowSalsaModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedSalsa === salsa
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {salsa}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Toppings Modal */}
      <Dialog open={showToppingsModal} onOpenChange={setShowToppingsModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>🥗 Seleccionar Toppings</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {TOPPINGS_OPTIONS.map((topping) => (
              <button
                key={topping}
                onClick={() => {
                  setSelectedToppings(topping)
                  setShowToppingsModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedToppings === topping
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {topping}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Precio Modal */}
      <Dialog open={showPrecioModal} onOpenChange={setShowPrecioModal}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>💰 Seleccionar Rango de Precio</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {PRECIO_OPTIONS.map((precio) => (
              <button
                key={precio}
                onClick={() => {
                  setSelectedPrecio(precio)
                  setShowPrecioModal(false)
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPrecio === precio
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {precio}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alergenos Modal */}
      <Dialog open={showAlergensModal} onOpenChange={setShowAlergensModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>⚠️ Filtrar por Alergenos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {ALERGENOS_OPTIONS.map((allergen) => (
              <button
                key={allergen}
                onClick={() => {
                  setSelectedAlergens((prev) =>
                    prev.includes(allergen)
                      ? prev.filter((a) => a !== allergen)
                      : [...prev, allergen]
                  )
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedAlergens.includes(allergen)
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-medium">{allergen}</div>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setShowAlergensModal(false)}
            className="w-full mt-4"
          >
            Aplicar Filtros
          </Button>
        </DialogContent>
      </Dialog>

      <SecondaryFiltersModal open={showSecondary} onOpenChange={setShowSecondary} />
    </>
  )
}
