import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'

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
  supplierId: string
  name: string
  cpf: string
  rg: string
  address: string
  cep: string
  phone: string
  email: string
  createdAt: string
}

export type SupplierCRM = {
  id: string
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
  clientsCRM: ClientCRM[]
  addClientCRM: (client: Omit<ClientCRM, 'id' | 'createdAt' | 'supplierId'>) => void
  suppliersCRM: SupplierCRM[]
  addSupplierCRM: (supplier: Omit<SupplierCRM, 'id' | 'createdAt' | 'companyId'>) => void
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
}

const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Admin',
    email: 'lhshowilumina@hotmail.com',
    role: 'admin',
    password: '123',
  },
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
      loyaltyPoints: 650, // Silver tier
      monthlyStats: {
        pointsEarned: 150,
        pointsEarnedPrev: 100,
        feeSavings: 350,
        feeSavingsPrev: 150,
      },
      paymentGateway: {
        provider: 'stripe',
        publicKey: 'pk_test_51...123',
        connected: true,
      },
      integrations: {
        google: {
          connected: true,
          lastSync: new Date().toISOString(),
          account: 'agenda.jd@gmail.com',
        },
      },
      billingSettings: {
        autoSend: true,
        subject: 'Aviso de Vencimento: Fatura Pendente',
        body: 'Olá [Customer Name],\n\nIdentificamos uma fatura pendente no valor de R$ [Amount] com vencimento em [Due Date].\n\nPor favor, realize o pagamento para evitar multas.',
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

const MOCK_CLIENTS_CRM: ClientCRM[] = [
  {
    id: 'crm1',
    supplierId: 'u1',
    name: 'Carlos Oliveira',
    email: 'carlos@exemplo.com',
    cpf: '111.222.333-44',
    rg: 'MG-12.345.678',
    cep: '01001-000',
    address: 'Praça da Sé, s/n - Centro, São Paulo',
    phone: '(11) 98765-4321',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crm2',
    supplierId: 'u1',
    name: 'Ana Júlia Silva',
    email: 'anaju@exemplo.com',
    cpf: '555.666.777-88',
    rg: 'SP-98.765.432',
    cep: '13010-111',
    address: 'Av. Francisco Glicério, 100 - Centro, Campinas',
    phone: '(19) 91234-5678',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const MOCK_SUPPLIERS_CRM: SupplierCRM[] = [
  {
    id: 'scrm1',
    companyId: 'u1',
    name: 'Flores & Cia',
    cnpjCpf: '11.222.333/0001-44',
    stateRegistration: '123456789',
    cep: '01001-000',
    street: 'Praça da Sé',
    number: 's/n',
    complement: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 98765-4321',
    email: 'contato@floresecia.com',
    category: 'decoracao',
    createdAt: new Date().toISOString(),
  },
]

const MOCK_SUPPLIER_DOCS: SupplierDocument[] = [
  {
    id: 'doc1',
    supplierId: 'scrm1',
    name: 'Alvara_Funcionamento_2026.pdf',
    type: 'application/pdf',
    uploadDate: new Date().toISOString(),
  },
  {
    id: 'doc2',
    supplierId: 'scrm1',
    name: 'Contrato_Prestacao_Servicos.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
  },
]

const MOCK_SUPPLIER_FINANCES: SupplierFinance[] = [
  {
    id: 'fin1',
    supplierId: 'scrm1',
    description: 'Adiantamento - Casamento Sítio das Palmeiras',
    amount: 2500,
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'overdue',
    demandId: 'd1',
    billingStatus: 'pending',
  },
  {
    id: 'fin2',
    supplierId: 'scrm1',
    description: 'Sinal - Evento Corporativo',
    amount: 1500,
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'paid',
  },
]

const MOCK_INCOME_RECORDS: IncomeRecord[] = [
  {
    id: 'inc1',
    companyId: 'u1',
    clientName: 'Empresa Alpha',
    amount: 8500,
    date: new Date().toISOString(),
    category: 'Locação de Equipamento',
    status: 'received',
    createdAt: new Date().toISOString(),
    demandId: 'd1',
  },
  {
    id: 'inc2',
    companyId: 'u1',
    clientName: 'Roberto Almeida',
    amount: 3200,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    category: 'Serviços Adicionais',
    status: 'pending',
    createdAt: new Date().toISOString(),
    billingStatus: 'sent',
    lastBilledAt: new Date().toISOString(),
  },
]

const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv1',
    companyId: 'u1',
    name: 'Mesa de Jantar Madeira',
    category: 'Móveis',
    totalQuantity: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv2',
    companyId: 'u1',
    name: 'Cadeira Tiffany Dourada',
    category: 'Móveis',
    totalQuantity: 300,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv3',
    companyId: 'u1',
    name: 'Arranjo de Flores Grande',
    category: 'Decoração',
    totalQuantity: 20,
    createdAt: new Date().toISOString(),
  },
]

const MOCK_INVENTORY_ALLOCATIONS: InventoryAllocation[] = [
  {
    id: 'alloc1',
    inventoryItemId: 'inv1',
    demandId: 'd1',
    quantity: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alloc2',
    inventoryItemId: 'inv2',
    demandId: 'd1',
    quantity: 100,
    createdAt: new Date().toISOString(),
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[1])
  const [role, setRole] = useState<Role>('company')
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
  const [clientsCRM, setClientsCRM] = useState<ClientCRM[]>(MOCK_CLIENTS_CRM)
  const [suppliersCRM, setSuppliersCRM] = useState<SupplierCRM[]>(MOCK_SUPPLIERS_CRM)
  const [supplierDocuments, setSupplierDocuments] = useState<SupplierDocument[]>(MOCK_SUPPLIER_DOCS)
  const [supplierFinances, setSupplierFinances] =
    useState<SupplierFinance[]>(MOCK_SUPPLIER_FINANCES)
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>(MOCK_INCOME_RECORDS)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS)
  const [inventoryAllocations, setInventoryAllocations] = useState<InventoryAllocation[]>(
    MOCK_INVENTORY_ALLOCATIONS,
  )

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
    let cId = ''

    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          cancelledDemandTitle = d.title
          cId = d.customerId
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
          title: 'Cancelamento Confirmado',
          message: `O evento "${cancelledDemandTitle}" foi cancelado. Como possuía seguro, o reembolso está em processamento via gateway.`,
          read: false,
          createdAt: new Date().toISOString(),
          customerId: cId || currentUser?.id,
        },
        ...prev,
      ])

      // Simulate API Call to External Gateway (Stripe/Mercado Pago)
      setTimeout(() => {
        setDemands((curr) =>
          curr.map((d) => (d.id === demandId ? { ...d, paymentStatus: 'refunded' } : d)),
        )
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

  useEffect(() => {
    if (!pb.authStore.isValid) {
      pb.collection('users')
        .authWithPassword('joao.doe@exemplo.com', 'Skip@Pass')
        .catch(() => {})
    }
  }, [])

  const login = async (email: string, password?: string) => {
    let pbUser: any = null
    try {
      const authData = await pb.collection('users').authWithPassword(email, password || 'Skip@Pass')
      pbUser = authData.record
    } catch (e) {
      console.warn('PB Auth failed')
    }

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        let user = users.find(
          (u) =>
            u.email === email && (u.password === password || password === 'Skip@Pass' || !password),
        )

        if (pbUser && !user) {
          user = {
            id: pbUser.id,
            name: pbUser.name || pbUser.email.split('@')[0],
            email: pbUser.email,
            role: (pbUser.role as Role) || 'customer',
          }
        }

        if (user) {
          if (pbUser) user.id = pbUser.id
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

  const addClientCRM = (clientData: Omit<ClientCRM, 'id' | 'createdAt' | 'supplierId'>) => {
    if (!currentUser) return
    const newClient: ClientCRM = {
      ...clientData,
      id: Math.random().toString(36).substring(7),
      supplierId: currentUser.id,
      createdAt: new Date().toISOString(),
    }
    setClientsCRM((prev) => [newClient, ...prev])
  }

  const addSupplierCRM = (supplierData: Omit<SupplierCRM, 'id' | 'createdAt' | 'companyId'>) => {
    if (!currentUser) return
    const newSupplier: SupplierCRM = {
      ...supplierData,
      id: Math.random().toString(36).substring(7),
      companyId: currentUser.id,
      createdAt: new Date().toISOString(),
    }
    setSuppliersCRM((prev) => [newSupplier, ...prev])
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
