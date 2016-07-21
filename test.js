var tape = require('tape')
var PouchDB = require('pouchdb-core')

PouchDB.plugin(require('pouchdb-adapter-leveldb'))
PouchDB.plugin(require('./'))

var db = new PouchDB('test', {db: require('memdown')})

tape('basic', function (t) {
  t.plan(7)

  var rev

  db.ensure({
    _id: 'me',
    wo: 'hey!'
  })
    .then(doc => {
      t.equals(doc.wo, 'hey!', 'doc saved first time')
      t.equals(doc._rev.slice(0, 2), '1-', 'rev is 1')
      rev = doc._rev

      return db.ensure({
        _id: 'me',
        wo: 'hey!'
      })
    })
    .then(doc => {
      t.equals(doc._rev, rev, 'rev is the same')
      t.equals(doc.wo, 'hey!', 'doc not saved again, but returned')

      return db.ensure({
        _id: 'me',
        wo: 'wo?'
      })
    })
    .then(doc => {
      t.equals(doc.wo, 'wo?', 'doc saved again, with changed value')
      t.notEquals(doc._rev, rev, 'rev is not the same')
      t.equals(doc._rev.slice(0, 2), '2-', 'it is 2 now')
    })
    .catch(e => {
      console.log(e)
      console.log(e.stack)
    })
})
