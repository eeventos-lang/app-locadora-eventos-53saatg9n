migrate(
  (app) => {
    const crmClients = new Collection({
      name: 'crm_clients',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'supplier_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'document', type: 'text' },
        { name: 'rg', type: 'text' },
        { name: 'cep', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'observations', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(crmClients)

    const crmSuppliers = new Collection({
      name: 'crm_suppliers',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'company_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'document', type: 'text' },
        { name: 'stateRegistration', type: 'text' },
        { name: 'service_category', type: 'text' },
        { name: 'cep', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'number', type: 'text' },
        { name: 'complement', type: 'text' },
        { name: 'neighborhood', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'observations', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(crmSuppliers)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('crm_clients'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('crm_suppliers'))
    } catch (_) {}
  },
)
