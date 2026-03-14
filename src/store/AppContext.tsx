import { createContext, useContext, useState, ReactNode } from 'react'

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
  doces?: boolean
  bolos?: boolean
  brinquedos?: boolean
  buffet_alternativo?: boolean
  details: string
}

export type DemandStatus = 'pending' | 'negotiating' | 'completed' | 'canceled'

export type PaymentStatus =
  | 'gathering'
  | 'pending_signature'
  | 'pending_payment'
  | 'escrow'
  | 'completed'
  | 'refunded'
  | 'processing_refund'

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
  contractedProviders: Record<string, string>
  createdAt: string
  hasInsurance?: boolean
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
  demandId?: string
  sector?: string
  read: boolean
  createdAt: string
  targetSupplierId?: string
  customerId?: string
}

export type IntegrationStatus = {
  connected: boolean
  lastSync: string
  account?: string
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
  unavailableDates?: string[]
  integrations?: {
    google?: IntegrationStatus
    outlook?: IntegrationStatus
  }
  safetyIndex?: number
  loyaltyPoints?: number
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

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'refunded'
  | 'disputed'
  | 'processing_refund'

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
  hasInsurance?: boolean
  sectors?: string[]
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

export type ScheduledInvitation = {
  id: string
  customerId: string
  supplierId: string
  title: string
  date: string
  status: 'pending' | 'sent'
  createdAt: string
}

export type Chat = {
  id: string
  participants: string[]
  updatedAt: string
}

export type ChatMessage = {
  id: string
  chatId: string
  senderId: string
  text: string
  createdAt: string
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
  cancelDemand: (demandId: string) => void
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
  payEvent: (demandId: string, hasInsurance?: boolean) => void
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
  scheduledInvitations: ScheduledInvitation[]
  addScheduledInvitation: (
    invitation: Omit<ScheduledInvitation, 'id' | 'createdAt' | 'status'>,
  ) => void
  getSupplierUnavailableDates: (supplierId: string) => Date[]
  chats: Chat[]
  messages: ChatMessage[]
  createChat: (participantId: string) => string
  sendChatMessage: (chatId: string, text: string) => void
  getSafetyIndex: (supplierId: string) => number
  redeemLoyaltyPoints: (points: number, reward: string) => void
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
      unavailableDates: ['2026-05-15', '2026-05-25'],
      safetyIndex: 98,
      loyaltyPoints: 350,
      integrations: {
        google: {
          connected: true,
          lastSync: new Date().toISOString(),
          account: 'agenda.jd@gmail.com',
        },
      },
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
      safetyIndex: 85,
      loyaltyPoints: 50,
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
    contractedProviders: { decoracao: 'p2' },
    createdAt: new Date().toISOString(),
    hasInsurance: true,
  },
  {
    id: 'd2',
    customerId: 'c1',
    title: 'Festa Corporativa de Fim de Ano',
    budget: 15000,
    guests: 100,
    date: '2026-12-10',
    location: 'Campinas, SP',
    requirements: {
      sound: true,
      light: true,
      led: false,
      grid: false,
      buffet: false,
      drinks: false,
      cocktails: false,
      photo: false,
      video: false,
      singer: false,
      band: false,
      dj: true,
      space: false,
      decoracao: false,
      ceremonial: false,
      security: false,
      details: 'Som e iluminação básica.',
    },
    status: 'pending',
    paymentStatus: 'escrow',
    sectorStatus: {
      sound: 'contracted',
      light: 'contracted',
      dj: 'contracted',
    },
    contractedProviders: { sound: 'p3', light: 'p3', dj: 'p3' },
    createdAt: new Date().toISOString(),
    hasInsurance: true,
  },
]

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p2',
    demandId: 'd1',
    supplierId: 'u1',
    supplierName: 'JD Decorações e Espaços',
    value: 3500,
    message: 'Proposta para decoração completa.',
    status: 'accepted',
    offeredSectors: ['decoracao'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    demandId: 'd2',
    supplierId: 'u2',
    supplierName: 'MS Áudio e Luz',
    value: 2000,
    message: 'Pacote som, luz e DJ.',
    status: 'accepted',
    offeredSectors: ['sound', 'light', 'dj'],
    createdAt: new Date().toISOString(),
  },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    demandId: 'd2',
    demandTitle: 'Festa Corporativa de Fim de Ano',
    customerId: 'c1',
    clientName: 'Cliente Teste',
    supplierId: 'u2',
    supplierName: 'MS Áudio e Luz',
    amount: 2000,
    date: new Date().toISOString(),
    status: 'completed',
    hasInsurance: true,
    sectors: ['sound', 'light', 'dj'],
  },
]

const MOCK_REVIEWS: Review[] = []
for (let i = 0; i < 15; i++) {
  MOCK_REVIEWS.push({
    id: `r_u1_${i}`,
    demandId: `d_mock_${i}`,
    customerId: 'c1',
    supplierId: 'u1',
    rating: 5,
    comment: [
      'Serviço excelente!',
      'Muito pontual',
      'Profissionalismo incrível',
      'Alta qualidade e ótimo atendimento',
    ][i % 4],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  })
}

const MOCK_FAVORITES: Favorite[] = [{ customerId: 'c1', supplierId: 'u1' }]

const MOCK_SCHEDULED: ScheduledInvitation[] = [
  {
    id: 's1',
    customerId: 'c1',
    supplierId: 'u1',
    title: 'Festa de Fim de Ano 2026',
    date: '2026-12-15T00:00:00.000Z',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: ['c1', 'u1'],
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    chatId: 'chat1',
    senderId: 'c1',
    text: 'Olá! Gostaria de tirar umas dúvidas sobre o orçamento.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'm2',
    chatId: 'chat1',
    senderId: 'u1',
    text: 'Oi! Claro, como posso ajudar? Estamos à disposição.',
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0])
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
  const [scheduledInvitations, setScheduledInvitations] =
    useState<ScheduledInvitation[]>(MOCK_SCHEDULED)
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)

  const addDemand = (demandData: any) => {
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
    setDemands([newDemand, ...demands])
  }

  const cancelDemand = (demandId: string) => {
    let cancelledDemandTitle = ''
    let refundIssued = false

    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          cancelledDemandTitle = d.title
          const isRefunded =
            d.hasInsurance && (d.paymentStatus === 'escrow' || d.paymentStatus === 'completed')
          refundIssued = isRefunded
          return {
            ...d,
            status: 'canceled',
            paymentStatus: isRefunded ? 'processing_refund' : d.paymentStatus,
          }
        }
        return d
      }),
    )

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.demandId === demandId && t.hasInsurance) {
          return { ...t, status: 'processing_refund' }
        }
        return t
      }),
    )

    if (refundIssued) {
      setNotifications((prev) => [
        {
          id: Math.random().toString(36).substring(7),
          title: 'Reembolso em Processamento',
          message: `O evento "${cancelledDemandTitle}" foi cancelado. Como possuía seguro ativo, o reembolso integral foi iniciado automaticamente.`,
          read: false,
          createdAt: new Date().toISOString(),
          customerId: currentUser?.id,
        },
        ...prev,
      ])
    }
  }

  const addProposal = (propData: any) => {
    const newProp: Proposal = {
      ...propData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setProposals([newProp, ...proposals])
  }

  const acceptProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'accepted' } : p)),
    )
  }

  const signContracts = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, paymentStatus: 'pending_payment' } : d)),
    )
  }

  const payEvent = (demandId: string, hasInsurance: boolean = false) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, paymentStatus: 'escrow', hasInsurance } : d)),
    )

    // Create transactions for accepted proposals
    const dProposals = proposals.filter((p) => p.demandId === demandId && p.status === 'accepted')
    const demand = demands.find((d) => d.id === demandId)
    if (!demand) return

    const newTransactions: Transaction[] = dProposals.map((p) => ({
      id: Math.random().toString(36).substring(7),
      demandId: demand.id,
      demandTitle: demand.title,
      customerId: demand.customerId,
      clientName: currentUser?.name || 'Cliente',
      supplierId: p.supplierId,
      supplierName: p.supplierName,
      amount: p.value,
      date: new Date().toISOString(),
      status: 'pending',
      hasInsurance,
      sectors: p.offeredSectors,
    }))
    setTransactions((prev) => [...newTransactions, ...prev])
  }

  const updateSectorStatus = (demandId: string, sector: string, status: SectorStatus) => {
    setDemands((prev) => {
      const newDemands = [...prev]
      const dIndex = newDemands.findIndex((d) => d.id === demandId)
      if (dIndex === -1) return prev

      const d = { ...newDemands[dIndex] }
      d.sectorStatus = { ...d.sectorStatus, [sector]: status }

      const contractedSectors = Object.keys(d.contractedProviders)
      const allConcluded =
        contractedSectors.length > 0 &&
        contractedSectors.every((s) => d.sectorStatus[s] === 'concluded')

      if (allConcluded && status === 'concluded' && d.status !== 'completed') {
        d.status = 'completed'
        d.paymentStatus = 'completed'

        // Update transactions to completed
        setTransactions((txs) =>
          txs.map((t) => (t.demandId === demandId ? { ...t, status: 'completed' } : t)),
        )

        // Award points to providers
        setTimeout(() => {
          const providersToReward = new Set(Object.values(d.contractedProviders))
          providersToReward.forEach((pid) => {
            setUsers((uList) =>
              uList.map((u) => {
                if (u.id === pid && u.companyProfile) {
                  return {
                    ...u,
                    companyProfile: {
                      ...u.companyProfile,
                      loyaltyPoints: (u.companyProfile.loyaltyPoints || 0) + 100,
                    },
                  }
                }
                return u
              }),
            )

            if (currentUser?.id === pid) {
              setCompanyProfile((cp) => ({ ...cp, loyaltyPoints: (cp.loyaltyPoints || 0) + 100 }))
            }

            setNotifications((n) => [
              {
                id: Math.random().toString(),
                title: 'Evento Concluído! +100 Pontos',
                message: `O evento ${d.title} foi finalizado. Seu pagamento foi liberado e você ganhou 100 Pontos de Fidelidade!`,
                read: false,
                createdAt: new Date().toISOString(),
                targetSupplierId: pid,
              },
              ...n,
            ])
          })
        }, 100)
      }

      newDemands[dIndex] = d
      return newDemands
    })
  }

  const disputeService = (demandId: string, sector: string, reason: string) => {
    updateSectorStatus(demandId, sector, 'disputed')
  }

  const inviteSupplier = (supplierId: string, demandId: string) => {
    setNotifications((prev) => [
      {
        id: Math.random().toString(36).substring(7),
        title: 'Novo Convite Direto!',
        message:
          'Você recebeu um convite exclusivo para um evento. Confira os detalhes e envie sua proposta.',
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: supplierId,
        demandId,
      },
      ...prev,
    ])
  }

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => {
      const updated = {
        ...prev,
        ...profile,
        isVerified: !!((prev.cnpj || profile.cnpj) && (prev.portfolio || profile.portfolio)),
      }
      if (currentUser) {
        const updatedUsers = users.map((u) =>
          u.id === currentUser.id ? { ...u, companyProfile: updated } : u,
        )
        setUsers(updatedUsers)
      }
      return updated
    })
  }

  const registerUser = async (userData: any) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(7),
      companyProfile:
        userData.role === 'company'
          ? {
              name: userData.name,
              specialties: '',
              sectors: userData.sectors || [],
              address: '',
              logo: '',
              observations: '',
              loyaltyPoints: 0,
            }
          : undefined,
    }
    setUsers([...users, newUser])
  }

  const login = async (email: string, password?: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
          setCurrentUser(user)
          setRole(user.role)
          if (user.companyProfile) setCompanyProfile(user.companyProfile)
          resolve()
        } else {
          reject(new Error('Credenciais inválidas.'))
        }
      }, 500)
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
      if (exists)
        return prev.filter((f) => !(f.customerId === currentUser.id && f.supplierId === supplierId))
      return [...prev, { customerId: currentUser.id, supplierId }]
    })
  }

  const addScheduledInvitation = (
    invitationData: Omit<ScheduledInvitation, 'id' | 'createdAt' | 'status'>,
  ) => {
    const newInv: ScheduledInvitation = {
      ...invitationData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setScheduledInvitations((prev) => [newInv, ...prev])
  }

  const getSupplierUnavailableDates = (supplierId: string) => {
    const supplier = users.find((u) => u.id === supplierId)
    const manualDates = supplier?.companyProfile?.unavailableDates || []
    const contractedProposals = proposals.filter(
      (p) => p.supplierId === supplierId && p.status === 'accepted',
    )
    const contractedDemandIds = contractedProposals.map((p) => p.demandId)
    const contractedDemands = demands.filter((d) => contractedDemandIds.includes(d.id))
    const allDatesStr = new Set([...manualDates, ...contractedDemands.map((d) => d.date)])

    return Array.from(allDatesStr).map((dStr) => {
      const [y, m, d] = dStr.split('T')[0].split('-').map(Number)
      return new Date(y, m - 1, d)
    })
  }

  const createChat = (participantId: string) => {
    if (!currentUser) return ''
    const existing = chats.find(
      (c) => c.participants.includes(currentUser.id) && c.participants.includes(participantId),
    )
    if (existing) return existing.id

    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      participants: [currentUser.id, participantId],
      updatedAt: new Date().toISOString(),
    }
    setChats([newChat, ...chats])
    return newChat.id
  }

  const sendChatMessage = (chatId: string, text: string) => {
    if (!currentUser) return
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      chatId,
      senderId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, updatedAt: new Date().toISOString() } : c)),
    )
  }

  const getSafetyIndex = (supplierId: string) => {
    const supplier = users.find((u) => u.id === supplierId)
    if (!supplier || !supplier.companyProfile) return 0

    const contractedProposals = proposals.filter(
      (p) => p.supplierId === supplierId && p.status === 'accepted',
    )
    const relevantDemands = demands.filter(
      (d) => contractedProposals.some((p) => p.demandId === d.id) && d.hasInsurance,
    )

    if (relevantDemands.length === 0) return supplier.companyProfile.safetyIndex ?? 100

    let successCount = 0
    relevantDemands.forEach((d) => {
      const supplierSectors =
        contractedProposals.find((p) => p.demandId === d.id)?.offeredSectors || []
      const hasIssue = supplierSectors.some(
        (s) => d.sectorStatus[s] === 'disputed' || d.sectorStatus[s] === 'not_delivered',
      )
      if (!hasIssue) {
        successCount++
      }
    })

    return Math.round((successCount / relevantDemands.length) * 100)
  }

  const redeemLoyaltyPoints = (points: number, reward: string) => {
    if (!currentUser || !companyProfile) return
    if ((companyProfile.loyaltyPoints || 0) < points) throw new Error('Pontos insuficientes')

    const newPoints = (companyProfile.loyaltyPoints || 0) - points
    updateCompanyProfile({ loyaltyPoints: newPoints })

    setNotifications((n) => [
      {
        id: Math.random().toString(),
        title: 'Recompensa Resgatada!',
        message: `Você resgatou com sucesso: ${reward}. Seus benefícios já estão ativos.`,
        read: false,
        createdAt: new Date().toISOString(),
        targetSupplierId: currentUser.id,
      },
      ...n,
    ])
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
        cancelDemand,
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
        scheduledInvitations,
        addScheduledInvitation,
        getSupplierUnavailableDates,
        chats,
        messages,
        createChat,
        sendChatMessage,
        getSafetyIndex,
        redeemLoyaltyPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) throw new Error('useApp must be used within an AppProvider')
  return context
}
