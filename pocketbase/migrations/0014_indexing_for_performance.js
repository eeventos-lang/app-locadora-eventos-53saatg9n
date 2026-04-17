migrate(
  (app) => {
    const proposals = app.findCollectionByNameOrId('proposals')
    proposals.addIndex('idx_proposals_status_customer', false, 'status, customer_id', '')
    app.save(proposals)

    const demands = app.findCollectionByNameOrId('demands')
    demands.addIndex('idx_demands_category', false, 'category', '')
    app.save(demands)
  },
  (app) => {
    const proposals = app.findCollectionByNameOrId('proposals')
    proposals.removeIndex('idx_proposals_status_customer')
    app.save(proposals)

    const demands = app.findCollectionByNameOrId('demands')
    demands.removeIndex('idx_demands_category')
    app.save(demands)
  },
)
