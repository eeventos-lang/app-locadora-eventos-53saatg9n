import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'customer' | 'company'

export type TechRequirement = {
  sound: boolean
  lighting: boolean
  light: boolean
  led: boolean
  grid: boolean
  details: string
}

export type Demand = {
  id: string
  title: string
  budget: number
  date: string
  location: string
  requirements: TechRequirement
  status: 'open' | 'closed'
  proposals: number
  createdAt: string
}

interface AppContextType {
  role: Role
  setRole: (role: Role) => void
  isSubscribed: boolean
  setIsSubscribed: (val: boolean) => void
  demands: Demand[]
  addDemand: (demand: Omit<Demand, 'id' | 'status' | 'proposals' | 'createdAt'>) => void
}

const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    title: 'Casamento Sítio das Palmeiras',
    budget: 5000,
    date: '2026-05-20',
    location: 'São Paulo, SP',
    requirements: {
      sound: true,
      lighting: true,
      light: false,
      led: false,
      grid: true,
      details: 'Preciso de PA para 300 pessoas, iluminação cênica na pista e grid Q30.',
    },
    status: 'open',
    proposals: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    title: 'Festa Corporativa Tech',
    budget: 12000,
    date: '2026-06-15',
    location: 'Campinas, SP',
    requirements: {
      sound: true,
      lighting: true,
      light: true,
      led: true,
      grid: true,
      details: 'Painel de LED 4x3 indoor, som para banda, luz de palco completa.',
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

  return (
    <AppContext.Provider
      value={{ role, setRole, isSubscribed, setIsSubscribed, demands, addDemand }}
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
