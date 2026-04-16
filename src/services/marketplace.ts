import pb from '@/lib/pocketbase/client'

export const getMarketplaceProposals = async () => {
  return await pb.collection('proposals').getFullList({
    expand: 'supplier_id,customer_id',
    sort: '-created',
  })
}

export const createMarketplaceProposal = async (data: any) => {
  return await pb.collection('proposals').create(data)
}

export const updateMarketplaceProposal = async (id: string, data: any) => {
  return await pb.collection('proposals').update(id, data)
}

export const getMarketplaceChats = async () => {
  return await pb.collection('chats').getFullList({
    expand: 'participants,proposal_id',
    sort: '-updated',
  })
}

export const createMarketplaceChat = async (data: any) => {
  return await pb.collection('chats').create(data)
}

export const getMarketplaceMessages = async (chatId: string) => {
  return await pb.collection('messages').getFullList({
    filter: `chat_id = "${chatId}"`,
    sort: 'created',
  })
}

export const sendMarketplaceMessage = async (data: any) => {
  return await pb.collection('messages').create(data)
}
