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
  targetSupplierId?: string
}

export type CompanyProfile = {
  name: string
  specialties: string
  sectors: string[]
  address: string
  logo: string
  observations: string
  cnpj?: string
  portfolio?: string
  isVerified?: boolean
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
  password?: string
  sectors?: string[]
  companyProfile?: CompanyProfile
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
  inviteSupplier: (supplierId: string, demandId: string) => void
}

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'JD Decorações',
    email: 'joao.doe@exemplo.com',
    role: 'company',
    password: '123',
    sectors: ['decoracao', 'space'],
    companyProfile: {
      name: 'JD Decorações e Espaços',
      specialties: 'Casamentos, Cenografia, Arranjos Florais',
      sectors: ['decoracao', 'space'],
      address: 'Av. das Flores, 123, São Paulo - SP',
      logo: '',
      observations: 'Transformando seu evento em um momento inesquecível.',
      cnpj: '12.345.678/0001-90',
      portfolio: 'portfolio_jd_2026.pdf',
      isVerified: true,
    },
  },
  {
    id: 'u2',
    name: 'MS Áudio e Luz',
    email: 'maria@exemplo.com',
    role: 'company',
    password: '123',
    sectors: ['sound', 'light', 'led'],
    companyProfile: {
      name: 'MS Áudio e Luz',
      specialties: 'PA, Iluminação Cênica, Painéis de LED indoor/outdoor',
      sectors: ['sound', 'light', 'led'],
      address: 'Rua do Som, 45, Campinas - SP',
      logo: '',
      observations: '',
      isVerified: false,
    },
  },
]

const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    title: 'Casamento Sítio das Palmeiras',
    budget: 65000,
    budgetBreakdown: { sound: 1500, light: 1000, decoracao: 3000 },
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
      details: 'Preciso de PA para 300 pessoas.',
    },
    status: 'negotiating',
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
      decoracao: false,
      ceremonial: false,
      security: true,
      details: 'Painel de LED 4x3 indoor.',
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
    supplierName: 'MS Áudio e Luz',
    value: 8500,
    message: 'Fornecemos o painel de LED com a melhor qualidade.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    demandId: 'd1',
    supplierId: 'u1',
    supplierName: 'JD Decorações',
    value: 3200,
    message: 'Decoração rústica completa com flores do campo.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    demandId: 'd2',
    supplierId: 'u1',
    supplierName: 'JD Decorações',
    value: 5000,
    message: 'Cenografia e lounges para o evento corporativo.',
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
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(
    MOCK_USERS[0].companyProfile!,
  )

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

  const inviteSupplier = (supplierId: string, demandId: string) => {
    const demand = demands.find((d) => d.id === demandId)
    if (!demand) return
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      title: 'Convite Direto de Cliente!',
      message: `Você foi convidado exclusivamente para enviar uma proposta para o evento: ${demand.title}`,
      demandId: demand.id,
      sector: 'invited',
      read: false,
      createdAt: new Date().toISOString(),
      targetSupplierId: supplierId,
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => {
      const updated = { ...prev, ...profile }
      updated.isVerified = !!(updated.cnpj && updated.portfolio)

      if (currentUser) {
        const updatedUser = { ...currentUser, companyProfile: updated }
        setCurrentUser(updatedUser)
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === currentUser.id ? updatedUser : u)))
      }
      return updated
    })
  }

  const registerUser = async (userData: Omit<User, 'id'>) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (users.find((u) => u.email === userData.email)) {
          reject(new Error('Este email já está em uso.'))
          return
        }
        const newUser: User = { ...userData, id: Math.random().toString(36).substring(7) }

        if (userData.role === 'company') {
          newUser.companyProfile = {
            name: userData.name,
            sectors: userData.sectors || [],
            specialties: '',
            address: '',
            logo: '',
            observations: '',
            isVerified: false,
          }
          setCompanyProfile(newUser.companyProfile)
        }

        setUsers((prev) => [...prev, newUser])
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
          if (user.companyProfile) {
            setCompanyProfile(user.companyProfile)
          }
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
        inviteSupplier,
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
