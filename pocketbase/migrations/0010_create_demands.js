migrate(
  (app) => {
    const collection = new Collection({
      name: 'demands',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != '' && @request.auth.role = 'customer'",
      updateRule:
        "@request.auth.id != '' && (customer_id = @request.auth.id || @request.auth.role = 'supplier' || @request.auth.role = 'company' || @request.auth.role = 'admin')",
      deleteRule: "@request.auth.id != '' && customer_id = @request.auth.id",
      fields: [
        {
          name: 'customer_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'in_analysis', 'accepted', 'completed', 'cancelled'],
        },
        { name: 'event_date', type: 'date' },
        { name: 'budget', type: 'number' },
        { name: 'location', type: 'text' },
        { name: 'guests', type: 'number' },
        { name: 'requirements', type: 'json' },
        { name: 'budgetBreakdown', type: 'json' },
        { name: 'paymentStatus', type: 'text' },
        { name: 'hasInsurance', type: 'bool' },
        { name: 'sectorStatus', type: 'json' },
        { name: 'contractedProviders', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('demands')
    app.delete(collection)
  },
)
