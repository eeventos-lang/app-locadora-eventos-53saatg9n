import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

export type Role = 'customer' | 'company' | 'supplier' | 'admin'

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

export type DemandStatus =
  | 'pending'
  | 'negotiating'
  | 'completed'
  | 'canceled'
  | 'cancelled'
  | 'in_analysis'
  | 'accepted'

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

export type PaymentGateway = {
  provider: 'stripe' | 'mercadopago' | ''
  publicKey: string
  connected: boolean
}

export type MonthlyStats = {
  pointsEarned: number
  pointsEarnedPrev: number
  feeSavings: number
  feeSavingsPrev: number
}

export type BillingSettings = {
  autoSend: boolean
  subject: string
  body: string
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
  paymentGateway?: PaymentGateway
  monthlyStats?: MonthlyStats
  billingSettings?: BillingSettings
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

export type ClientCRM = {
  id: string
  collectionId: string
  supplierId: string
  name: string
  cpf: string
  rg: string
  address: string
  cep: string
  phone: string
  email: string
  attachments?: string[]
  createdAt: string
}

export type SupplierCRM = {
  id: string
  collectionId: string
  companyId: string
  name: string
  cnpjCpf: string
  stateRegistration: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  phone: string
  email: string
  category: string
  attachments?: string[]
  createdAt: string
}

export type SupplierDocument = {
  id: string
  supplierId: string
  name: string
  type: string
  uploadDate: string
}

export type SupplierFinanceStatus = 'pending' | 'paid' | 'overdue'

export type SupplierFinance = {
  id: string
  supplierId: string
  description: string
  amount: number
  dueDate: string
  status: SupplierFinanceStatus
  demandId?: string
  billingStatus?: 'pending' | 'sent' | 'failed'
  lastBilledAt?: string
}

export type IncomeStatus = 'received' | 'pending' | 'cancelled'

export type IncomeRecord = {
  id: string
  companyId: string
  clientName: string
  amount: number
  date: string
  category: string
  status: IncomeStatus
  createdAt: string
  demandId?: string
  billingStatus?: 'pending' | 'sent' | 'failed'
  lastBilledAt?: string
}

export type InventoryItem = {
  id: string
  companyId: string
  name: string
  category: string
  totalQuantity: number
  createdAt: string
}

export type InventoryAllocation = {
  id: string
  inventoryItemId: string
  demandId: string
  quantity: number
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
  ) => Promise<void>
  cancelDemand: (demandId: string) => Promise<void>
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
  signContracts: (demandId: string) => Promise<void>
  payEvent: (demandId: string, hasInsurance?: boolean) => Promise<void>
  updateSectorStatus: (demandId: string, sector: string, status: SectorStatus) => Promise<void>
  disputeService: (demandId: string, sector: string, reason: string) => Promise<void>
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
  clientsCRM: ClientCRM[]
  addClientCRM: (
    client: Omit<ClientCRM, 'id' | 'createdAt' | 'supplierId' | 'collectionId' | 'attachments'>,
    files?: File[],
  ) => Promise<void>
  suppliersCRM: SupplierCRM[]
  addSupplierCRM: (
    supplier: Omit<SupplierCRM, 'id' | 'createdAt' | 'companyId' | 'collectionId' | 'attachments'>,
    files?: File[],
  ) => Promise<void>
  supplierDocuments: SupplierDocument[]
  addSupplierDocument: (doc: Omit<SupplierDocument, 'id' | 'uploadDate'>) => void
  deleteSupplierDocument: (id: string) => void
  supplierFinances: SupplierFinance[]
  addSupplierFinance: (fin: Omit<SupplierFinance, 'id'>) => void
  incomeRecords: IncomeRecord[]
  addIncomeRecord: (record: Omit<IncomeRecord, 'id' | 'createdAt' | 'companyId'>) => void
  updateBillingStatus: (type: 'income' | 'finance', id: string, status: 'sent' | 'failed') => void
  inventoryItems: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'companyId'>) => void
  deleteInventoryItem: (id: string) => void
  inventoryAllocations: InventoryAllocation[]
  allocateInventory: (alloc: Omit<InventoryAllocation, 'id' | 'createdAt'>) => void
  deallocateInventory: (id: string) => void
  isInitializing: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>('customer')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
  const [demands, setDemands] = useState<Demand[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: '',
    specialties: '',
    sectors: [],
    address: '',
    logo: '',
    observations: '',
    loyaltyPoints: 0,
    safetyIndex: 100,
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [scheduledInvitations, setScheduledInvitations] = useState<ScheduledInvitation[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [clientsCRM, setClientsCRM] = useState<ClientCRM[]>([])
  const [suppliersCRM, setSuppliersCRM] = useState<SupplierCRM[]>([])
  const [supplierDocuments, setSupplierDocuments] = useState<SupplierDocument[]>([])
  const [supplierFinances, setSupplierFinances] = useState<SupplierFinance[]>([])
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [inventoryAllocations, setInventoryAllocations] = useState<InventoryAllocation[]>([])
  const [isInitializing, setIsInitializing] = useState(true)

  const loadData = useCallback(async () => {
    if (!pb.authStore.isValid) {
      setClientsCRM([])
      setSuppliersCRM([])
      setDemands([])
      return
    }
    try {
      const [clientsRecords, suppliersRecords, demandsRecords] = await Promise.all([
        pb.collection('crm_clients').getFullList({ sort: '-created' }),
        pb.collection('crm_suppliers').getFullList({ sort: '-created' }),
        pb.collection('demands').getFullList({ sort: '-created' }),
      ])

      setClientsCRM(
        clientsRecords.map((r) => ({
          id: r.id,
          collectionId: r.collectionId,
          supplierId: r.supplier_id,
          name: r.name,
          cpf: r.document,
          rg: r.rg,
          address: r.address,
          cep: r.cep,
          phone: r.phone,
          email: r.email,
          attachments: r.attachments || [],
          createdAt: r.created,
        })),
      )

      setSuppliersCRM(
        suppliersRecords.map((r) => ({
          id: r.id,
          collectionId: r.collectionId,
          companyId: r.company_id,
          name: r.name,
          cnpjCpf: r.document,
          stateRegistration: r.stateRegistration,
          cep: r.cep,
          street: r.street,
          number: r.number,
          complement: r.complement,
          neighborhood: r.neighborhood,
          city: r.city,
          state: r.state,
          phone: r.phone,
          email: r.email,
          category: r.service_category,
          attachments: r.attachments || [],
          createdAt: r.created,
        })),
      )

      setDemands(
        demandsRecords.map((d) => ({
          id: d.id,
          customerId: d.customer_id,
          title: d.title,
          budget: d.budget || 0,
          budgetBreakdown: d.budgetBreakdown || {},
          guests: d.guests || 0,
          date: d.event_date || '',
          location: d.location || '',
          requirements: d.requirements || {},
          status: d.status as DemandStatus,
          paymentStatus: (d.paymentStatus as PaymentStatus) || 'gathering',
          sectorStatus: d.sectorStatus || {},
          contractedProviders: d.contractedProviders || {},
          createdAt: d.created,
          hasInsurance: d.hasInsurance || false,
        })),
      )
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  useEffect(() => {
    const initApp = async () => {
      try {
        if (pb.authStore.isValid) {
          try {
            await pb.collection('users').authRefresh()
            if (pb.authStore.record) {
              const pbUser = pb.authStore.record
              const user: User = {
                id: pbUser.id,
                name: pbUser.name || pbUser.email.split('@')[0],
                email: pbUser.email,
                role: (pbUser.role as Role) || 'customer',
              }
              setCurrentUser(user)
              setRole(user.role)
            }
          } catch (e) {
            pb.authStore.clear()
          }
        }
      } catch (err) {
        console.error('Init Auth failed:', err)
        pb.authStore.clear()
      } finally {
        setIsInitializing(false)
        loadData()
      }
    }

    initApp()

    const unsub = pb.authStore.onChange((token, model) => {
      if (model) {
        const user: User = {
          id: model.id,
          name: model.name || model.email.split('@')[0],
          email: model.email,
          role: (model.role as Role) || 'customer',
        }
        setCurrentUser(user)
        setRole(user.role)
        loadData()
      } else {
        setCurrentUser(null)
        setClientsCRM([])
        setSuppliersCRM([])
        setDemands([])
      }
    })

    return () => unsub()
  }, [loadData])

  useRealtime('crm_clients', () => {
    loadData()
  })

  useRealtime('crm_suppliers', () => {
    loadData()
  })

  useRealtime('demands', () => {
    loadData()
  })

  const addDemand = async (demandData: any) => {
    if (!currentUser || currentUser.role !== 'customer') {
      throw new Error('Apenas clientes podem criar eventos.')
    }
    await pb.collection('demands').create({
      customer_id: currentUser.id,
      title: demandData.title,
      description: demandData.requirements?.details || '',
      status: 'pending',
      event_date: demandData.date,
      budget: demandData.budget,
      location: demandData.location,
      guests: demandData.guests,
      requirements: demandData.requirements,
      budgetBreakdown: demandData.budgetBreakdown || {},
      paymentStatus: 'gathering',
      hasInsurance: false,
      sectorStatus: {},
      contractedProviders: {},
    })
  }

  const cancelDemand = async (demandId: string) => {
    const demand = demands.find((d) => d.id === demandId)
    if (!demand) return

    let cancelledDemandTitle = demand.title
    let cId = demand.customerId
    const isRefunded =
      demand.hasInsurance &&
      (demand.paymentStatus === 'escrow' || demand.paymentStatus === 'completed')
    let refundIssued = isRefunded

    await pb.collection('demands').update(demandId, {
      status: 'cancelled',
      paymentStatus: isRefunded ? 'processing_refund' : demand.paymentStatus,
    })

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
          title: 'Cancelamento Confirmado',
          message: `O evento "${cancelledDemandTitle}" foi cancelado. Como possuía seguro, o reembolso está em processamento via gateway.`,
          read: false,
          createdAt: new Date().toISOString(),
          customerId: cId || currentUser?.id,
        },
        ...prev,
      ])

      setTimeout(() => {
        setTransactions((curr) =>
          curr.map((t) =>
            t.demandId === demandId && t.hasInsurance ? { ...t, status: 'refunded' } : t,
          ),
        )
        setNotifications((prev) => [
          {
            id: Math.random().toString(36).substring(7),
            title: 'Reembolso Concluído',
            message: `O estorno via gateway de pagamento para o evento "${cancelledDemandTitle}" foi processado com sucesso.`,
            read: false,
            createdAt: new Date().toISOString(),
            customerId: cId || currentUser?.id,
          },
          ...prev,
        ])
      }, 3000)
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

  const signContracts = async (demandId: string) => {
    await pb.collection('demands').update(demandId, { paymentStatus: 'pending_payment' })
  }

  const payEvent = async (demandId: string, hasInsurance: boolean = false) => {
    await pb.collection('demands').update(demandId, { paymentStatus: 'escrow', hasInsurance })

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

  const updateSectorStatus = async (demandId: string, sector: string, status: SectorStatus) => {
    const demand = demands.find((d) => d.id === demandId)
    if (!demand) return

    const newSectorStatus = { ...demand.sectorStatus, [sector]: status }
    const contractedSectors = Object.keys(demand.contractedProviders || {})

    let isCompleted = false
    if (contractedSectors.length > 0) {
      isCompleted = contractedSectors.every((s) =>
        s === sector ? status === 'concluded' : newSectorStatus[s] === 'concluded',
      )
    }

    const payload: any = { sectorStatus: newSectorStatus }
    if (isCompleted && demand.status !== 'completed') {
      payload.status = 'completed'
      payload.paymentStatus = 'completed'
    }

    await pb.collection('demands').update(demandId, payload)

    if (payload.status === 'completed') {
      setTransactions((txs) =>
        txs.map((t) => (t.demandId === demandId ? { ...t, status: 'completed' } : t)),
      )

      setTimeout(() => {
        const providersToReward = new Set(Object.values(demand.contractedProviders || {}))
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
              message: `O evento ${demand.title} foi finalizado. Seu pagamento foi liberado e você ganhou 100 Pontos de Fidelidade!`,
              read: false,
              createdAt: new Date().toISOString(),
              targetSupplierId: pid as string,
            },
            ...n,
          ])
        })
      }, 100)
    }
  }

  const disputeService = async (demandId: string, sector: string, reason: string) => {
    await updateSectorStatus(demandId, sector, 'disputed')
  }

  const inviteSupplier = (supplierId: string, demandId: string) => {
    setNotifications((prev) => [
      {
        id: Math.random().toString(36).substring(7),
        title: 'Novo Convite Direto!',
        message:
          'Você recebeu um convite exclusivo para um evento. Confira os detalhes e enviem sua proposta.',
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
    const record = await pb.collection('users').create({
      email: userData.email,
      password: userData.password || 'Skip@Pass',
      passwordConfirm: userData.password || 'Skip@Pass',
      name: userData.name,
      role: userData.role,
    })

    const newUser: User = {
      id: record.id,
      name: record.name || record.email.split('@')[0],
      email: record.email,
      role: (record.role as Role) || 'customer',
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
              safetyIndex: 100,
            }
          : undefined,
    }
    setUsers((prev) => [...prev, newUser])
  }

  const login = async (email: string, password?: string) => {
    const authData = await pb.collection('users').authWithPassword(email, password || 'Skip@Pass')
    const pbUser = authData.record
    const user: User = {
      id: pbUser.id,
      name: pbUser.name || pbUser.email.split('@')[0],
      email: pbUser.email,
      role: (pbUser.role as Role) || 'customer',
    }
    setCurrentUser(user)
    setRole(user.role)
    await loadData()
  }

  const logout = () => {
    pb.authStore.clear()
    setCurrentUser(null)
    setRole('customer')
    setClientsCRM([])
    setSuppliersCRM([])
    setDemands([])
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

  const addClientCRM = async (
    clientData: Omit<ClientCRM, 'id' | 'createdAt' | 'supplierId' | 'collectionId' | 'attachments'>,
    files?: File[],
  ) => {
    if (!pb.authStore.isValid || !pb.authStore.record) {
      throw new Error('Você precisa estar autenticado para salvar clientes.')
    }

    const formData = new FormData()
    formData.append('supplier_id', pb.authStore.record.id)
    formData.append('name', clientData.name)
    formData.append('document', clientData.cpf)
    formData.append('rg', clientData.rg || '')
    formData.append('address', clientData.address)
    formData.append('cep', clientData.cep)
    formData.append('phone', clientData.phone)
    formData.append('email', clientData.email || '')

    if (files && files.length > 0) {
      files.forEach((file) => formData.append('attachments', file))
    }

    await pb.collection('crm_clients').create(formData)
  }

  const addSupplierCRM = async (
    supplierData: Omit<
      SupplierCRM,
      'id' | 'createdAt' | 'companyId' | 'collectionId' | 'attachments'
    >,
    files?: File[],
  ) => {
    if (!pb.authStore.isValid || !pb.authStore.record) {
      throw new Error('Você precisa estar autenticado para salvar fornecedores.')
    }

    const formData = new FormData()
    formData.append('company_id', pb.authStore.record.id)
    formData.append('name', supplierData.name)
    formData.append('document', supplierData.cnpjCpf)
    formData.append('stateRegistration', supplierData.stateRegistration || '')
    formData.append('service_category', supplierData.category)
    formData.append('cep', supplierData.cep)
    formData.append('street', supplierData.street)
    formData.append('number', supplierData.number)
    formData.append('complement', supplierData.complement || '')
    formData.append('neighborhood', supplierData.neighborhood)
    formData.append('city', supplierData.city)
    formData.append('state', supplierData.state)
    formData.append('phone', supplierData.phone)
    formData.append('email', supplierData.email || '')

    if (files && files.length > 0) {
      files.forEach((file) => formData.append('attachments', file))
    }

    await pb.collection('crm_suppliers').create(formData)
  }

  const addSupplierDocument = (docData: Omit<SupplierDocument, 'id' | 'uploadDate'>) => {
    setSupplierDocuments((prev) => [
      ...prev,
      {
        ...docData,
        id: Math.random().toString(36).substring(7),
        uploadDate: new Date().toISOString(),
      },
    ])
  }

  const deleteSupplierDocument = (id: string) => {
    setSupplierDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const addSupplierFinance = (finData: Omit<SupplierFinance, 'id'>) => {
    setSupplierFinances((prev) => [
      ...prev,
      { ...finData, id: Math.random().toString(36).substring(7) },
    ])
  }

  const addIncomeRecord = (record: Omit<IncomeRecord, 'id' | 'createdAt' | 'companyId'>) => {
    if (!currentUser) return
    setIncomeRecords((prev) => [
      {
        ...record,
        id: Math.random().toString(36).substring(7),
        companyId: currentUser.id,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const updateBillingStatus = (
    type: 'income' | 'finance',
    id: string,
    status: 'sent' | 'failed',
  ) => {
    if (type === 'income') {
      setIncomeRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, billingStatus: status, lastBilledAt: new Date().toISOString() } : r,
        ),
      )
    } else {
      setSupplierFinances((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, billingStatus: status, lastBilledAt: new Date().toISOString() } : f,
        ),
      )
    }
  }

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'companyId'>) => {
    if (!currentUser) return
    setInventoryItems((prev) => [
      {
        ...item,
        id: Math.random().toString(36).substring(7),
        companyId: currentUser.id,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const deleteInventoryItem = (id: string) => {
    setInventoryItems((prev) => prev.filter((i) => i.id !== id))
    setInventoryAllocations((prev) => prev.filter((a) => a.inventoryItemId !== id))
  }

  const allocateInventory = (alloc: Omit<InventoryAllocation, 'id' | 'createdAt'>) => {
    setInventoryAllocations((prev) => [
      ...prev,
      {
        ...alloc,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
      },
    ])
  }

  const deallocateInventory = (id: string) => {
    setInventoryAllocations((prev) => prev.filter((a) => a.id !== id))
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
        clientsCRM,
        addClientCRM,
        suppliersCRM,
        addSupplierCRM,
        supplierDocuments,
        addSupplierDocument,
        deleteSupplierDocument,
        supplierFinances,
        addSupplierFinance,
        incomeRecords,
        addIncomeRecord,
        updateBillingStatus,
        inventoryItems,
        addInventoryItem,
        deleteInventoryItem,
        inventoryAllocations,
        allocateInventory,
        deallocateInventory,
        isInitializing,
      }}
    >
      {isInitializing ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Inicializando aplicação...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) throw new Error('useApp must be used within an AppProvider')
  return context
}
