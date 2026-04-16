onRecordCreate((e) => {
  const record = e.record
  const chatId = record.get('chat_id')

  if (!chatId) return e.next()

  try {
    const chat = $app.findRecordById('chats', chatId)
    const proposalId = chat.get('proposal_id')

    if (!proposalId) return e.next()

    const proposal = $app.findRecordById('proposals', proposalId)
    const status = proposal.getString('status')

    if (status !== 'paid') {
      let content = record.getString('content') || ''

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-.\s]?\d{4}/g

      let masked = false

      if (emailRegex.test(content) || phoneRegex.test(content)) {
        content = content.replace(emailRegex, '[Informação Oculta]')
        content = content.replace(phoneRegex, '[Informação Oculta]')
        masked = true
      }

      if (masked) {
        record.set('content', content)
        record.set('is_masked', true)
      }
    }
  } catch (err) {
    console.log('Error masking message:', err)
  }

  return e.next()
}, 'messages')
