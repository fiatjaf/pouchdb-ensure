var deepEqual = require('deep-equal')

module.exports = {
  ensure: ensure
}

function ensure (doc) {
  var db = this

  return db.get(doc._id)
    .then(old => {
      var rev = old._rev
      delete old._rev
      if (deepEqual(doc, old)) {
        old._rev = rev
        return old._rev
      } else {
        doc._rev = rev
        return db.put(doc).then(res => res.rev)
      }
    }, err => {
      if (err.status !== 404) {
        throw err
      }
      return db.put(doc).then(res => res.rev)
    })
    .then(rev => {
      doc._rev = rev
      return doc
    })
}
