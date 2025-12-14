// Rate wizard utility functions

export interface RateState {
  currentStep: number
  selectedConsumption: string
  selectedAppetizers: string[]
}

export const advanceStep = (step: number): void => {
  const steps = document.querySelectorAll('.wizard-step')
  steps.forEach(s => s.classList.remove('active'))
  document.getElementById(`step${step}`)?.classList.add('active')

  // Update progress dots
  const dots = document.querySelectorAll('.progress-dot')
  dots.forEach((dot, index) => {
    if (index < step) {
      dot.classList.add('completed')
      dot.classList.remove('active')
    } else if (index === step) {
      dot.classList.add('active')
      dot.classList.remove('completed')
    } else {
      dot.classList.remove('active', 'completed')
    }
  })
}

export const selectConsumption = (element: HTMLElement, type: string): void => {
  const btns = element.parentElement?.querySelectorAll('.filter-btn')
  btns?.forEach(b => b.classList.remove('active'))
  element.classList.add('active')
}

export const toggleAppetizer = (element: HTMLElement, type: string): void => {
  element.classList.toggle('active')
}

export const selectBurgerToRate = (burgerId: number): void => {
  advanceStep(2)
}

export const setSectionRating = (section: string, rating: number, event: Event): void => {
  const target = event.target as HTMLElement
  const buttons = target.parentElement?.querySelectorAll('.star-btn')
  buttons?.forEach(b => b.classList.remove('active'))
  target.classList.add('active')
}

export const toggleSectionTag = (element: HTMLElement): void => {
  element.classList.toggle('active')
}

export const setRating = (stars: number): void => {
  const buttons = document.querySelectorAll('.rating-input .star-btn')
  buttons.forEach((btn, index) => {
    if (index < stars) {
      btn.classList.add('active')
      btn.textContent = '★'
    } else {
      btn.classList.remove('active')
      btn.textContent = '☆'
    }
  })
}

export const resetRate = (): void => {
  // Reset all form fields
  const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select')
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.value = ''
    } else if (input instanceof HTMLSelectElement) {
      input.selectedIndex = 0
    }
  })

  // Reset all buttons
  const buttons = document.querySelectorAll('.star-btn, .filter-btn')
  buttons.forEach(btn => btn.classList.remove('active'))

  // Reset to step 0
  advanceStep(0)
}
