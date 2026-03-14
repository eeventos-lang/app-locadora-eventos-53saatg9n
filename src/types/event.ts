import { TechRequirement } from '@/store/AppContext'

export type EventFormData = {
  title: string
  guests: number
  date: string
  location: string
  requirements: TechRequirement
}

export type EventConfigs = {
  buffetGuests: number
  cocktailsGuests: number
  drinksGuests: number
  securityCount: number
}
