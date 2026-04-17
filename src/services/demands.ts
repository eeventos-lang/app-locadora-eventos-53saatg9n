import pb from '@/lib/pocketbase/client'

export interface DemandsRecord {
  id?: string
  customer_id: string
  title: string
  description?: string
  category?: string
  status: 'pending' | 'in_analysis' | 'accepted' | 'completed' | 'cancelled'
  event_date?: string
  budget?: number
  location?: string
  guests?: number
  requirements?: any
  budgetBreakdown?: any
  paymentStatus?: string
  hasInsurance?: boolean
  sectorStatus?: any
  contractedProviders?: any
  project_notes?: string
  created?: string
  updated?: string
}

export const getDemands = async () => {
  return pb
    .collection('demands')
    .getFullList<DemandsRecord>({ filter: 'customer_id != ""', sort: '-created' })
}

export const getDemand = async (id: string) => {
  return pb.collection('demands').getOne<DemandsRecord>(id)
}

export const createDemand = async (data: Omit<DemandsRecord, 'id' | 'created' | 'updated'>) => {
  return pb.collection('demands').create<DemandsRecord>(data)
}

export const updateDemand = async (id: string, data: Partial<DemandsRecord>) => {
  return pb.collection('demands').update<DemandsRecord>(id, data)
}

export const deleteDemand = async (id: string) => {
  return pb.collection('demands').delete(id)
}
