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
  decoracao: boolean
  ceremonial: boolean
  security: boolean
  details: string
}

export type DemandStatus = 'pending' | 'negotiating' | 'completed'

export type Demand = {
  id: string
  title: string
  budget: number
  budgetBreakdown?: Record<string, number>
  guests: number
  date: string
  location: string
  requirements: TechRequirement
  status: DemandStatus
  createdAt: string
}

export type Proposal = {
  id: string
  demandId: string
  supplierId: string
  supplierName: string
  value: number
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export type Notification = {
  id: string
  title: string
  message: string
  demandId: string
  sector: string
  read: boolean
  createdAt: string
}

export type CompanyProfile = {
  name: string
  specialties: string
  sectors: string[]
  address: string
  logo: string
  observations: string
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
  password?: string
  sectors?: string[]
}

interface AppContextType {
  role: Role
  setRole: (role: Role) => void
  isSubscribed: boolean
  setIsSubscribed: (val: boolean) => void
  demands: Demand[]
  addDemand: (demand: Omit<Demand, 'id' | 'status' | 'createdAt'>) => void
  companyProfile: CompanyProfile
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void
  users: User[]
  currentUser: User | null
  registerUser: (user: Omit<User, 'id'>) => Promise<void>
  login: (email: string, password?: string) => Promise<void>
  logout: () => void
  proposals: Proposal[]
  addProposal: (proposal: Omit<Proposal, 'id' | 'status' | 'createdAt'>) => void
  acceptProposal: (proposalId: string) => void
  notifications: Notification[]
  markNotificationsAsRead: () => void
}

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'João Doe',
    email: 'joao.doe@exemplo.com',
    role: 'company',
    password: 'password123',
    sectors: ['decoracao', 'space'],
  },
]

const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    title: 'Casamento Sítio das Palmeiras',
    budget: 65000,
    budgetBreakdown: {
      sound: 1500,
      light: 1000,
      grid: 800,
      buffet: 45000,
      cocktails: 7000,
      band: 4000,
      dj: 1000,
      decoracao: 3000,
      ceremonial: 1500,
    },
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
      decoracao: true,
      ceremonial: true,
      security: false,
      details:
        'Preciso de PA para 300 pessoas, iluminação cênica na pista, grid Q30 e banda para festa.',
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    title: 'Festa Corporativa Tech',
    budget: 95000,
    budgetBreakdown: {
      sound: 1500,
      light: 1000,
      led: 2500,
      grid: 800,
      buffet: 22500,
      drinks: 7500,
      photo: 2000,
      video: 2500,
      dj: 1000,
      space: 5000,
      security: 300,
    },
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
      decoracao: false,
      ceremonial: false,
      security: true,
      details: 'Painel de LED 4x3 indoor, som para DJ, luz de palco completa e buffet completo.',
    },
    status: 'negotiating',
    createdAt: new Date().toISOString(),
  },
]

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    demandId: 'd2',
    supplierId: 'u2',
    supplierName: 'Empresa XPTO',
    value: 8500,
    message:
      'Podemos fornecer o painel de LED com a melhor qualidade e equipe técnica de apoio. Nossa montagem é rápida e o suporte está incluso no valor total da locação.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>('customer')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
  const [demands, setDemands] = useState<Demand[]>(MOCK_DEMANDS)
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'JD Decorações',
    specialties: 'Casamentos, Cenografia, Flores',
    sectors: ['decoracao', 'space'],
    address: 'Av. das Flores, 123',
    logo: '',
    observations: '',
  })

  const addDemand = (demandData: Omit<Demand, 'id' | 'status' | 'createdAt'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setDemands([newDemand, ...demands])

    const newNotifs = Object.entries(demandData.requirements)
      .filter(([_, val]) => val)
      .map(([sector]) => ({
        id: Math.random().toString(36).substring(7),
        title: 'Nova demanda disponível!',
        message: newDemand.title,
        demandId: newDemand.id,
        sector,
        read: false,
        createdAt: new Date().toISOString(),
      }))
    setNotifications((prev) => [...newNotifs, ...prev])
  }

  const addProposal = (propData: Omit<Proposal, 'id' | 'status' | 'createdAt'>) => {
    const newProp: Proposal = {
      ...propData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [newProp, ...prev])
    setDemands((prev) =>
      prev.map((d) =>
        d.id === propData.demandId && d.status === 'pending' ? { ...d, status: 'negotiating' } : d,
      ),
    )
  }

  const acceptProposal = (proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId)
    if (!prop) return

    setProposals((prev) =>
      prev.map((p) => {
        if (p.demandId === prop.demandId) {
          return p.id === proposalId ? { ...p, status: 'accepted' } : { ...p, status: 'rejected' }
        }
        return p
      }),
    )
    setDemands((prev) =>
      prev.map((d) => (d.id === prop.demandId ? { ...d, status: 'completed' } : d)),
    )
  }

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...profile }))
  }

  const registerUser = async (userData: Omit<User, 'id'>) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (users.find((u) => u.email === userData.email)) {
          reject(new Error('Este email já está em uso.'))
          return
        }
        const newUser: User = { ...userData, id: Math.random().toString(36).substring(7) }
        setUsers((prev) => [...prev, newUser])

        if (userData.role === 'company') {
          setCompanyProfile((prev) => ({
            ...prev,
            name: userData.name,
            sectors: userData.sectors || [],
          }))
        }

        resolve()
      }, 800)
    })
  }

  const login = async (email: string, password?: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
          setCurrentUser(user)
          setRole(user.role)
          resolve()
        } else {
          reject(new Error('Credenciais inválidas. Tente novamente.'))
        }
      }, 800)
    })
  }

  const logout = () => {
    setCurrentUser(null)
    setRole('customer')
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
        users,
        currentUser,
        registerUser,
        login,
        logout,
        proposals,
        addProposal,
        acceptProposal,
        notifications,
        markNotificationsAsRead,
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
