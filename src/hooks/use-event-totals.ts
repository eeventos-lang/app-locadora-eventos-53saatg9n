import { EventFormData, EventConfigs } from '@/types/event'
import { SERVICES } from '@/lib/services'
import { TechRequirement } from '@/store/AppContext'

export const useEventTotals = (formData: EventFormData, configs: EventConfigs) => {
  let total = 0
  const lines: Array<{
    name: string
    detail: string
    qty: number
    unit: number
    subtotal: number
  }> = []

  const addLine = (name: string, detail: string, qty: number, unit: number) => {
    const subtotal = qty * unit
    total += subtotal
    lines.push({ name, detail, qty, unit, subtotal })
  }

  const fixed = {
    sound: 1500,
    light: 1000,
    led: 2500,
    grid: 800,
    photo: 2000,
    video: 2500,
    singer: 1200,
    band: 4000,
    dj: 1000,
    space: 5000,
    ceremonial: 1500,
  }

  SERVICES.forEach((s) => {
    if (formData.requirements[s.id as keyof TechRequirement] && s.id in fixed) {
      addLine(s.label, 'Taxa Fixa', 1, fixed[s.id as keyof typeof fixed])
    }
  })

  if (formData.requirements.buffet) {
    const p = { prime: 150, premium: 200, top: 300 }[configs.buffetTier]
    addLine('Buffet', `Classe ${configs.buffetTier.toUpperCase()}`, configs.buffetGuests, p)
  }
  if (formData.requirements.drinks) addLine('Bebidas', 'Por pessoa', configs.drinksGuests, 50)
  if (formData.requirements.cocktails)
    addLine('Bar Drinks', 'Por pessoa', configs.cocktailsGuests, 70)
  if (formData.requirements.security) addLine('Seguranças', 'Qtd', configs.securityCount, 150)

  return { total, lines }
}
