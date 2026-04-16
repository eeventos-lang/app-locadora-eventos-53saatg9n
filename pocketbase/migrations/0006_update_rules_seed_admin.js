migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'lhshowilumina@hotmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('lhshowilumina@hotmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      record.set('role', 'admin')
      app.save(record)
    }

    const proposals = app.findCollectionByNameOrId('proposals')
    proposals.listRule =
      "@request.auth.id != '' && (customer_id = @request.auth.id || supplier_id = @request.auth.id)"
    proposals.viewRule =
      "@request.auth.id != '' && (customer_id = @request.auth.id || supplier_id = @request.auth.id)"
    app.save(proposals)

    const chats = app.findCollectionByNameOrId('chats')
    chats.listRule = "@request.auth.id != '' && participants ?= @request.auth.id"
    app.save(chats)

    const messages = app.findCollectionByNameOrId('messages')
    messages.createRule = "@request.auth.id != '' && chat_id.participants ?= @request.auth.id"
    app.save(messages)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'lhshowilumina@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
