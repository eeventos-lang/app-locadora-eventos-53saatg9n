import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'customer' | 'company'

export type TechRequirement = {
  sound: boolean
  light: boolean
  led: boolean
  grid: boolean
  buffet: boolean
  drinks: boolean
  cocktails: boolean
  photo: boolean
  video: boolean
  singer: boolean
  band: boolean
  dj: boolean
  space: boolean
  ceremonial: boolean
  security: boolean
  details: string
}

export type Demand = {
  id: string
  title: string
  budget: number
  guests: number
  date: string
  location: string
  requirements: TechRequirement
  status: 'open' | 'closed'
  proposals: number
  createdAt: string
}

export type CompanyProfile = {
  name: string
  specialties: string
  address: string
  logo: string
  observations: string
}

interface AppContextType {
  role: Role
  setRole: (role: Role) => void
  isSubscribed: boolean
  setIsSubscribed: (val: boolean) => void
  demands: Demand[]
  addDemand: (demand: Omit<Demand, 'id' | 'status' | 'proposals' | 'createdAt'>) => void
  companyProfile: CompanyProfile
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void
}

const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    title: 'Casamento Sítio das Palmeiras',
    budget: 65000,
    guests: 300,
    date: '2026-05-20',
    location: 'São Paulo, SP',
    requirements: {
      sound: true,
      light: true,
      led: false,
      grid: true,
      buffet: true,
      drinks: false,
      cocktails: true,
      photo: false,
      video: false,
      singer: false,
      band: true,
      dj: true,
      space: false,
      ceremonial: true,
      security: false,
      details:
        'Preciso de PA para 300 pessoas, iluminação cênica na pista, grid Q30 e banda para festa.',
    },
    status: 'open',
    proposals: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    title: 'Festa Corporativa Tech',
    budget: 95000,
    guests: 150,
    date: '2026-06-15',
    location: 'Campinas, SP',
    requirements: {
      sound: true,
      light: true,
      led: true,
      grid: true,
      buffet: true,
      drinks: true,
      cocktails: false,
      photo: true,
      video: true,
      singer: false,
      band: false,
      dj: true,
      space: true,
      ceremonial: false,
      security: true,
      details: 'Painel de LED 4x3 indoor, som para DJ, luz de palco completa e buffet completo.',
    },
    status: 'open',
    proposals: 5,
    createdAt: new Date().toISOString(),
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('customer')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
  const [demands, setDemands] = useState<Demand[]>(MOCK_DEMANDS)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'JD Eventos Tech',
    specialties: 'Som, Iluminação, Painel de LED',
    address: '',
    logo: '',
    observations: '',
  })

  const addDemand = (demandData: Omit<Demand, 'id' | 'status' | 'proposals' | 'createdAt'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Math.random().toString(36).substring(7),
      status: 'open',
      proposals: 0,
      createdAt: new Date().toISOString(),
    }
    setDemands([newDemand, ...demands])
  }

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...profile }))
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isSubscribed,
        setIsSubscribed,
        demands,
        addDemand,
        companyProfile,
        updateCompanyProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
