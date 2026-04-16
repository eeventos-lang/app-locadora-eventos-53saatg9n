migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const roleField = users.fields.getByName('role')
    if (roleField) {
      roleField.selectValues = [
        ...new Set([...roleField.selectValues, 'customer', 'supplier', 'company']),
      ]
    }
    app.save(users)

    const proposals = new Collection({
      name: 'proposals',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (customer_id = @request.auth.id || supplier_id = @request.auth.id)",
      viewRule:
        "@request.auth.id != '' && (customer_id = @request.auth.id || supplier_id = @request.auth.id)",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (customer_id = @request.auth.id || supplier_id = @request.auth.id)",
      deleteRule: null,
      fields: [
        {
          name: 'customer_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        {
          name: 'supplier_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'amount', type: 'number', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'paid', 'cancelled'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(proposals)

    const chats = new Collection({
      name: 'chats',
      type: 'base',
      listRule: "@request.auth.id != '' && participants ?= @request.auth.id",
      viewRule: "@request.auth.id != '' && participants ?= @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && participants ?= @request.auth.id",
      deleteRule: null,
      fields: [
        {
          name: 'participants',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 10,
        },
        {
          name: 'proposal_id',
          type: 'relation',
          required: true,
          collectionId: proposals.id,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(chats)

    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule: "@request.auth.id != '' && chat_id.participants ?= @request.auth.id",
      viewRule: "@request.auth.id != '' && chat_id.participants ?= @request.auth.id",
      createRule: "@request.auth.id != '' && chat_id.participants ?= @request.auth.id",
      updateRule: "@request.auth.id != '' && sender_id = @request.auth.id",
      deleteRule: null,
      fields: [
        { name: 'chat_id', type: 'relation', required: true, collectionId: chats.id, maxSelect: 1 },
        {
          name: 'sender_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'content', type: 'text', required: true },
        { name: 'is_masked', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(messages)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('messages'))
    app.delete(app.findCollectionByNameOrId('chats'))
    app.delete(app.findCollectionByNameOrId('proposals'))
  },
)
