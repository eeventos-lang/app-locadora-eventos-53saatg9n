migrate(
  (app) => {
    // 1. Remove member_id from transactions
    try {
      const transactions = app.findCollectionByNameOrId('transactions')
      if (transactions.fields.getByName('member_id')) {
        transactions.fields.removeByName('member_id')
        app.save(transactions)
      }
    } catch (err) {
      console.log('Transactions collection not found or error updating.', err)
    }

    // 2. Delete attendance collection
    try {
      const attendance = app.findCollectionByNameOrId('attendance')
      app.delete(attendance)
    } catch (err) {
      console.log('Attendance collection not found or already deleted.', err)
    }

    // 3. Delete members collection
    try {
      const members = app.findCollectionByNameOrId('members')
      app.delete(members)
    } catch (err) {
      console.log('Members collection not found or already deleted.', err)
    }

    // 4. Update users collection to only have event rental specific roles
    try {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const roleField = users.fields.getByName('role')
      if (roleField) {
        roleField.values = ['admin', 'customer', 'supplier', 'company']
        app.save(users)
      }
    } catch (err) {
      console.log('Users collection not found or error updating role field.', err)
    }
  },
  (app) => {
    // Safe to leave empty, destructive operations usually don't have down migrations for schemas
  },
)
