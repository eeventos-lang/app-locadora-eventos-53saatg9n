migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('crm_suppliers')
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
    const col = app.findCollectionByNameOrId('crm_suppliers')
    col.fields.removeByName('attachments')
    app.save(col)
  },
)
