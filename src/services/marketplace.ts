import pb from '@/lib/pocketbase/client'

export const getMarketplaceProposals = () =>
  pb.collection('proposals').getFullList({ expand: 'customer_id,supplier_id' })
export const createMarketplaceProposal = (data: any) => pb.collection('proposals').create(data)
export const updateMarketplaceProposal = (id: string, data: any) =>
  pb.collection('proposals').update(id, data)
export const getMarketplaceChats = () =>
  pb
    .collection('chats')
    .getFullList({
      expand: 'participants,proposal_id,proposal_id.customer_id,proposal_id.supplier_id',
    })
export const createMarketplaceChat = (data: any) => pb.collection('chats').create(data)
export const getMarketplaceMessages = (chatId: string) =>
  pb.collection('messages').getFullList({ filter: `chat_id = '${chatId}'`, sort: 'created' })
export const sendMarketplaceMessage = (data: any) => pb.collection('messages').create(data)
