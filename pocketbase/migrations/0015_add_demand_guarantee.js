migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('demands')
    if (!col.fields.getByName('has_guarantee')) {
      col.fields.add(new BoolField({ name: 'has_guarantee' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('demands')
    if (col.fields.getByName('has_guarantee')) {
      col.fields.removeByName('has_guarantee')
    }
    app.save(col)
  },
)
