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

export type SectorStatus = 'pending' | 'contracted' | 'concluded' | 'not_delivered' | 'disputed'

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

export type TransactionStatus = 'pending' | 'completed' | 'refunded' | 'disputed'

export type Transaction = {
  id: string
  demandId: string
  demandTitle: string
  customerId: string
  clientName: string
  supplierId: string
  supplierName: string
  amount: number
  date: string
  status: TransactionStatus
}

export type Review = {
  id: string
  demandId: string
  customerId: string
  supplierId: string
  rating: number
  comment: string
  createdAt: string
}

export type Favorite = {
  customerId: string
  supplierId: string
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
  disputeService: (demandId: string, sector: string, reason: string) => void
  transactions: Transaction[]
  notifications: Notification[]
  markNotificationsAsRead: () => void
  inviteSupplier: (supplierId: string, demandId: string) => void
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  favorites: Favorite[]
  toggleFavorite: (supplierId: string) => void
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
    sectors: ['decoracao', 'space', 'buffet'],
    companyProfile: {
      name: 'JD Decorações e Espaços',
      specialties: 'Casamentos, Cenografia, Arranjos Florais, Buffet Completo',
      sectors: ['decoracao', 'space', 'buffet'],
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
  {
    id: 'd3',
    customerId: 'c1',
    title: 'Festa de Aniversário (Concluída)',
    budget: 5000,
    guests: 50,
    date: '2026-01-10',
    location: 'São Paulo, SP',
    requirements: {
      sound: true,
      light: false,
      led: false,
      grid: false,
      buffet: true,
      drinks: false,
      cocktails: false,
      photo: false,
      video: false,
      singer: false,
      band: false,
      dj: false,
      space: false,
      decoracao: false,
      ceremonial: false,
      security: false,
      details: '',
    },
    status: 'completed',
    paymentStatus: 'completed',
    sectorStatus: {
      sound: 'concluded',
      buffet: 'concluded',
    },
    contractedProviders: {
      sound: 'p4',
      buffet: 'p5',
    },
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
  {
    id: 'p4',
    demandId: 'd3',
    supplierId: 'u2',
    supplierName: 'MS Áudio e Luz',
    value: 1500,
    message: 'Kit som básico entregue.',
    status: 'accepted',
    offeredSectors: ['sound'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    demandId: 'd3',
    supplierId: 'u1',
    supplierName: 'JD Decorações',
    value: 3500,
    message: 'Serviço de buffet completo.',
    status: 'accepted',
    offeredSectors: ['buffet'],
    createdAt: new Date().toISOString(),
  },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    demandId: 'd1',
    demandTitle: 'Casamento Sítio das Palmeiras',
    customerId: 'c1',
    clientName: 'Cliente Teste',
    supplierId: 'u1',
    supplierName: 'JD Decorações',
    amount: 3200,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'pending',
  },
]

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    demandId: 'd3',
    customerId: 'c1',
    supplierId: 'u1',
    rating: 5,
    comment: 'Serviço excelente! Comida maravilhosa e equipe muito educada.',
    createdAt: new Date().toISOString(),
  },
]

const MOCK_FAVORITES: Favorite[] = [
  {
    customerId: 'c1',
    supplierId: 'u1',
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]) // Auto-login as customer for ease
  const [role, setRole] = useState<Role>('customer')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
  const [demands, setDemands] = useState<Demand[]>(MOCK_DEMANDS)
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(
    MOCK_USERS[1].companyProfile!,
  )
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [favorites, setFavorites] = useState<Favorite[]>(MOCK_FAVORITES)

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

      const client = users.find((u) => u.id === demand.customerId)
      const acceptedProposals = proposals.filter(
        (p) => p.demandId === demand.id && p.status === 'accepted',
      )

      const newTransactions: Transaction[] = acceptedProposals.map((p) => ({
        id: Math.random().toString(36).substring(7),
        demandId: demand.id,
        demandTitle: demand.title,
        customerId: demand.customerId,
        clientName: client?.name || 'Cliente',
        supplierId: p.supplierId,
        supplierName: p.supplierName,
        amount: p.value,
        date: new Date().toISOString(),
        status: 'pending',
      }))

      setTransactions((prev) => [...newTransactions, ...prev])

      const newNotifs = uniqueProviders.map((supId) => ({
        id: Math.random().toString(36).substring(7),
        title: 'Evento Pago e Confirmado!',
        message: `O cliente realizou o pagamento seguro para o evento ${demand.title}. 30% do valor está liberado para seus custos operacionais.`,
        demandId: demand.id,
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: supId as string,
      }))

      const newNotifCustomer: Notification = {
        id: Math.random().toString(36).substring(7),
        title: 'Pagamento Seguro Confirmado!',
        message: `Seu pagamento para o evento "${demand.title}" foi aprovado e os fundos estão em custódia na plataforma.`,
        demandId: demand.id,
        read: false,
        createdAt: new Date().toISOString(),
        customerId: demand.customerId,
      }

      setNotifications((prev) => [...newNotifs, newNotifCustomer, ...prev])
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

    const demand = demands.find((d) => d.id === demandId)
    if (demand) {
      const providerId = demand.contractedProviders[sector]
      const proposal = proposals.find((p) => p.id === providerId)
      if (proposal) {
        setTransactions((prev) =>
          prev.map((t) => {
            if (t.demandId === demandId && t.supplierId === proposal.supplierId) {
              return {
                ...t,
                status:
                  status === 'concluded'
                    ? 'completed'
                    : status === 'not_delivered'
                      ? 'refunded'
                      : t.status,
              }
            }
            return t
          }),
        )
      }
    }
  }

  const disputeService = (demandId: string, sector: string, reason: string) => {
    updateSectorStatus(demandId, sector, 'disputed')

    const demand = demands.find((d) => d.id === demandId)
    if (demand) {
      const providerId = demand.contractedProviders[sector]
      const proposal = proposals.find((p) => p.id === providerId)

      const newNotifProvider: Notification = {
        id: Math.random().toString(36).substring(7),
        title: 'Serviço em Disputa!',
        message: `O cliente abriu uma disputa para o serviço contratado. Motivo: ${reason}`,
        demandId: demand.id,
        sector,
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: proposal?.supplierId,
      }

      const newNotifCustomer: Notification = {
        id: Math.random().toString(36).substring(7),
        title: 'Disputa Iniciada',
        message: `Sua disputa para o serviço foi registrada e enviada para mediação da plataforma. Os fundos continuam retidos.`,
        demandId: demand.id,
        sector,
        read: false,
        createdAt: new Date().toISOString(),
        customerId: demand.customerId,
      }

      const newNotifAdmin: Notification = {
        id: Math.random().toString(36).substring(7),
        title: 'Nova Disputa Requer Mediação',
        message: `O cliente abriu uma disputa no evento ${demand.title}. Motivo: ${reason}`,
        demandId: demand.id,
        sector,
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: 'admin',
      }

      setNotifications((prev) => [newNotifProvider, newNotifCustomer, newNotifAdmin, ...prev])

      if (proposal) {
        setTransactions((prev) =>
          prev.map((t) => {
            if (t.demandId === demandId && t.supplierId === proposal.supplierId) {
              return { ...t, status: 'disputed' }
            }
            return t
          }),
        )
      }
    }
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

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) => [newReview, ...prev])
  }

  const toggleFavorite = (supplierId: string) => {
    if (!currentUser) return
    setFavorites((prev) => {
      const exists = prev.find(
        (f) => f.customerId === currentUser.id && f.supplierId === supplierId,
      )
      if (exists) {
        return prev.filter((f) => !(f.customerId === currentUser.id && f.supplierId === supplierId))
      }
      return [...prev, { customerId: currentUser.id, supplierId }]
    })
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
        disputeService,
        transactions,
        notifications,
        markNotificationsAsRead,
        inviteSupplier,
        reviews,
        addReview,
        favorites,
        toggleFavorite,
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
