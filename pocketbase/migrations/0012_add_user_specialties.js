migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('specialties')) {
      users.fields.add(
        new JSONField({
          name: 'specialties',
          required: false,
          maxSize: 2000000,
        }),
      )
    }
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.fields.removeByName('specialties')
    app.save(users)
  },
)
