import { EventFormData, EventConfigs } from '@/types/event'
import { SERVICES } from '@/lib/services'
import { TechRequirement } from '@/store/AppContext'

export const useEventTotals = (formData: EventFormData, configs: EventConfigs) => {
  let total = 0
  const lines: Array<{
    id: string
    name: string
    detail: string
    qty: number
    unit: number
    subtotal: number
  }> = []
  const breakdown: Record<string, number> = {}

  const addLine = (id: string, name: string, detail: string, qty: number, unit: number) => {
    const subtotal = qty * unit
    total += subtotal
    breakdown[id] = subtotal
    lines.push({ id, name, detail, qty, unit, subtotal })
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
    decoracao: 3000,
    ceremonial: 1500,
  }

  SERVICES.forEach((s) => {
    if (formData.requirements[s.id as keyof TechRequirement] && s.id in fixed) {
      addLine(s.id, s.label, 'Taxa Fixa', 1, fixed[s.id as keyof typeof fixed])
    }
  })

  if (formData.requirements.buffet) {
    addLine('buffet', 'Buffet', 'Por pessoa', configs.buffetGuests, 150)
  }
  if (formData.requirements.drinks) {
    addLine('drinks', 'Bebidas', 'Por pessoa', configs.drinksGuests, 50)
  }
  if (formData.requirements.cocktails) {
    addLine('cocktails', 'Bar Drinks', 'Por pessoa', configs.cocktailsGuests, 70)
  }
  if (formData.requirements.security) {
    addLine('security', 'Seguranças', 'Qtd', configs.securityCount, 150)
  }

  return { total, lines, breakdown }
}
