migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let customerId = ''
    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'lhshowilumina@hotmail.com')
      admin.set('role', 'customer')
      app.save(admin)
      customerId = admin.id
    } catch (_) {
      const record = new Record(users)
      record.setEmail('lhshowilumina@hotmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin Customer')
      record.set('role', 'customer')
      app.save(record)
      customerId = record.id
    }

    const demands = app.findCollectionByNameOrId('demands')

    try {
      app.findFirstRecordByData('demands', 'title', 'Casamento Praia - DB')
    } catch (_) {
      const d1 = new Record(demands)
      d1.set('customer_id', customerId)
      d1.set('title', 'Casamento Praia - DB')
      d1.set('description', 'Festa para 150 pessoas com pé na areia')
      d1.set('category', 'casamento')
      d1.set('status', 'pending')
      d1.set('event_date', '2027-10-15 14:00:00.000Z')
      d1.set('budget', 25000)
      d1.set('location', 'Ilhabela, SP')
      d1.set('guests', 150)
      d1.set('requirements', { sound: true, buffet: true })
      d1.set('paymentStatus', 'pending_payment')
      app.save(d1)
    }

    try {
      app.findFirstRecordByData('demands', 'title', 'Festa Corporativa Fim de Ano - DB')
    } catch (_) {
      const d2 = new Record(demands)
      d2.set('customer_id', customerId)
      d2.set('title', 'Festa Corporativa Fim de Ano - DB')
      d2.set('description', 'Confraternização da empresa com banda e open bar')
      d2.set('category', 'corporativo')
      d2.set('status', 'pending')
      d2.set('event_date', '2026-12-10 19:00:00.000Z')
      d2.set('budget', 50000)
      d2.set('location', 'São Paulo, SP')
      d2.set('guests', 300)
      d2.set('requirements', { sound: true, band: true, drinks: true })
      d2.set('paymentStatus', 'gathering')
      app.save(d2)
    }
  },
  (app) => {
    try {
      const d1 = app.findFirstRecordByData('demands', 'title', 'Casamento Praia - DB')
      app.delete(d1)
    } catch (_) {}
    try {
      const d2 = app.findFirstRecordByData('demands', 'title', 'Festa Corporativa Fim de Ano - DB')
      app.delete(d2)
    } catch (_) {}
  },
)
