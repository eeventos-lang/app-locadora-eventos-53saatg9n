migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('crm_clients')
    if (!col.fields.getByName('attachments')) {
      col.fields.add(
        new FileField({
          name: 'attachments',
          maxSelect: 10,
          maxSize: 5242880,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('crm_clients')
    col.fields.removeByName('attachments')
    app.save(col)
  },
)
