migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('demands')

    if (!col.fields.getByName('project_notes')) {
      col.fields.add(
        new TextField({
          name: 'project_notes',
          required: false,
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('demands')
    if (col.fields.getByName('project_notes')) {
      col.fields.removeByName('project_notes')
      app.save(col)
    }
  },
)
