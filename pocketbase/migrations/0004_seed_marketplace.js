migrate((app) => {
  const users = app.findCollectionByNameOrId('_pb_users_auth_')

  let customerId = ''
  try {
    const customer = app.findAuthRecordByEmail('_pb_users_auth_', 'cliente@exemplo.com')
    customerId = customer.id
  } catch (_) {
    const customer = new Record(users)
    customer.setEmail('cliente@exemplo.com')
    customer.setPassword('Skip@Pass')
    customer.setVerified(true)
    customer.set('name', 'Cliente Teste')
    customer.set('role', 'customer')
    app.save(customer)
    customerId = customer.id
  }

  let supplierId = ''
  try {
    const supplier = app.findAuthRecordByEmail('_pb_users_auth_', 'joao.doe@exemplo.com')
    supplierId = supplier.id
  } catch (_) {
    const supplier = new Record(users)
    supplier.setEmail('joao.doe@exemplo.com')
    supplier.setPassword('Skip@Pass')
    supplier.setVerified(true)
    supplier.set('name', 'JD Decorações')
    supplier.set('role', 'supplier')
    app.save(supplier)
    supplierId = supplier.id
  }

  let proposalId = ''
  const proposals = app.findCollectionByNameOrId('proposals')
  try {
    const proposal = app.findFirstRecordByData(
      'proposals',
      'description',
      'Proposta de Decoração Completa (PB)',
    )
    proposalId = proposal.id
  } catch (_) {
    const proposal = new Record(proposals)
    proposal.set('customer_id', customerId)
    proposal.set('supplier_id', supplierId)
    proposal.set('amount', 3500)
    proposal.set('status', 'pending')
    proposal.set('description', 'Proposta de Decoração Completa (PB)')
    app.save(proposal)
    proposalId = proposal.id
  }

  let chatId = ''
  const chats = app.findCollectionByNameOrId('chats')
  try {
    const chat = app.findFirstRecordByData('chats', 'proposal_id', proposalId)
    chatId = chat.id
  } catch (_) {
    const chat = new Record(chats)
    chat.set('participants', [customerId, supplierId])
    chat.set('proposal_id', proposalId)
    app.save(chat)
    chatId = chat.id
  }

  const messages = app.findCollectionByNameOrId('messages')
  try {
    app.findFirstRecordByData('messages', 'chat_id', chatId)
  } catch (_) {
    const msg = new Record(messages)
    msg.set('chat_id', chatId)
    msg.set('sender_id', supplierId)
    msg.set(
      'content',
      'Olá! Segue a proposta. Meu telefone é 11 99999-9999 e meu email é joao@exemplo.com',
    )
    app.save(msg)
  }
})
