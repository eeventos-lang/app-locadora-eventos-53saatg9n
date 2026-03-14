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

export type PaymentStatus =
  | 'gathering'
  | 'pending_signature'
  | 'pending_payment'
  | 'escrow'
  | 'completed'

export type SectorStatus = 'pending' | 'contracted' | 'concluded' | 'not_delivered'

export type Demand = {
  id: string
  customerId: string
  title: string
  budget: number
  budgetBreakdown?: Record<string, number>
  guests: number
  date: string
  location: string
  requirements: TechRequirement
  status: DemandStatus
  paymentStatus: PaymentStatus
  sectorStatus: Record<string, SectorStatus>
  contractedProviders: Record<string, string> // sector -> proposal id
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
  offeredSectors: string[]
  createdAt: string
}

export type Notification = {
  id: string
  title: string
  message: string
  demandId: string
  sector?: string
  read: boolean
  createdAt: string
  targetSupplierId?: string
  customerId?: string
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
  addDemand: (
    demand: Omit<
      Demand,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'paymentStatus'
      | 'sectorStatus'
      | 'contractedProviders'
      | 'customerId'
    >,
  ) => void
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
  signContracts: (demandId: string) => void
  payEvent: (demandId: string) => void
  updateSectorStatus: (demandId: string, sector: string, status: SectorStatus) => void
  notifications: Notification[]
  markNotificationsAsRead: () => void
  inviteSupplier: (supplierId: string, demandId: string) => void
}

const MOCK_USERS: User[] = [
  {
    id: 'c1',
    name: 'Cliente Teste',
    email: 'cliente@exemplo.com',
    role: 'customer',
    password: '123',
  },
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
    customerId: 'c1',
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
    paymentStatus: 'gathering',
    sectorStatus: {
      sound: 'pending',
      light: 'pending',
      grid: 'pending',
      buffet: 'pending',
      cocktails: 'pending',
      band: 'pending',
      dj: 'pending',
      decoracao: 'contracted',
      ceremonial: 'pending',
    },
    contractedProviders: {
      decoracao: 'p2',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    customerId: 'c1',
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
    paymentStatus: 'gathering',
    sectorStatus: {
      sound: 'pending',
      light: 'pending',
      led: 'pending',
      grid: 'pending',
      buffet: 'pending',
      drinks: 'pending',
      photo: 'pending',
      video: 'pending',
      dj: 'pending',
      space: 'pending',
      security: 'pending',
    },
    contractedProviders: {},
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
    offeredSectors: ['led'],
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
    offeredSectors: ['decoracao'],
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
    offeredSectors: ['space'],
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
    MOCK_USERS[1].companyProfile!,
  )

  const addDemand = (
    demandData: Omit<
      Demand,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'paymentStatus'
      | 'sectorStatus'
      | 'contractedProviders'
      | 'customerId'
    >,
  ) => {
    const newDemand: Demand = {
      ...demandData,
      id: Math.random().toString(36).substring(7),
      customerId: currentUser?.id || 'c1',
      status: 'pending',
      paymentStatus: 'gathering',
      sectorStatus: {},
      contractedProviders: {},
      createdAt: new Date().toISOString(),
    }

    Object.keys(demandData.requirements).forEach((key) => {
      if (
        demandData.requirements[key as keyof TechRequirement] &&
        typeof demandData.requirements[key as keyof TechRequirement] === 'boolean'
      ) {
        newDemand.sectorStatus[key] = 'pending'
      }
    })

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

    const demand = demands.find((d) => d.id === propData.demandId)
    if (demand) {
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        title: 'Novo fornecedor interessado!',
        message: `${newProp.supplierName} enviou uma proposta para o seu evento. A plataforma assegura que o seu dinheiro será preservado e repassado apenas após o fornecimento dos serviços.`,
        demandId: demand.id,
        read: false,
        createdAt: new Date().toISOString(),
        customerId: demand.customerId,
      }
      setNotifications((prev) => [newNotif, ...prev])
    }
  }

  const acceptProposal = (proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId)
    if (!prop) return

    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) return { ...p, status: 'accepted' }
        return p
      }),
    )

    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === prop.demandId) {
          const newSectorStatus = { ...d.sectorStatus }
          const newContractedProviders = { ...d.contractedProviders }

          prop.offeredSectors?.forEach((sector) => {
            newSectorStatus[sector] = 'contracted'
            newContractedProviders[sector] = prop.id
          })

          const requestedSectors = Object.keys(newSectorStatus)
          const allCovered =
            requestedSectors.length > 0 &&
            requestedSectors.every((s) => newSectorStatus[s] !== 'pending')

          let newPaymentStatus = d.paymentStatus
          if (allCovered && d.paymentStatus === 'gathering') {
            newPaymentStatus = 'pending_signature'
          }

          return {
            ...d,
            status: allCovered ? 'negotiating' : d.status,
            sectorStatus: newSectorStatus,
            contractedProviders: newContractedProviders,
            paymentStatus: newPaymentStatus,
          }
        }
        return d
      }),
    )

    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      title: 'Proposta Aceita!',
      message: `Sua proposta para o evento foi aceita pelo cliente.`,
      demandId: prop.demandId,
      read: false,
      createdAt: new Date().toISOString(),
      targetSupplierId: prop.supplierId,
    }

    setNotifications((prev) => [newNotif, ...prev])
  }

  const signContracts = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, paymentStatus: 'pending_payment' } : d)),
    )
  }

  const payEvent = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, paymentStatus: 'escrow' } : d)),
    )

    const demand = demands.find((d) => d.id === demandId)
    if (demand) {
      const contractedIds = Object.values(demand.contractedProviders)
      const uniqueProviders = Array.from(
        new Set(
          contractedIds
            .map((pId) => proposals.find((p) => p.id === pId)?.supplierId)
            .filter(Boolean),
        ),
      )

      const newNotifs = uniqueProviders.map((supId) => ({
        id: Math.random().toString(36).substring(7),
        title: 'Evento Pago e Confirmado!',
        message: `O cliente realizou o pagamento seguro para o evento ${demand.title}. 30% do valor está liberado para seus custos operacionais.`,
        demandId: demand.id,
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: supId as string,
      }))

      setNotifications((prev) => [...newNotifs, ...prev])
    }
  }

  const updateSectorStatus = (demandId: string, sector: string, status: SectorStatus) => {
    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          const newSectorStatus = { ...d.sectorStatus, [sector]: status }
          const allDone = Object.values(newSectorStatus).every(
            (s) => s === 'concluded' || s === 'not_delivered',
          )
          return {
            ...d,
            sectorStatus: newSectorStatus,
            paymentStatus: allDone ? 'completed' : d.paymentStatus,
            status: allDone ? 'completed' : d.status,
          }
        }
        return d
      }),
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
        signContracts,
        payEvent,
        updateSectorStatus,
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
