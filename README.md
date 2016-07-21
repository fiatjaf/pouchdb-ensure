pouchdb-ensure
======

A PouchDB plugin.

Creates a doc or updates it, but only when necessary.

Good to make sure a design doc is saved on the database at startup time, and that it is updated on the database whenever it is changed on the code.

### Usage

```bash
npm install --save pouchdb-ensure
```

```js
PouchDB.plugin(require('pouchdb-ensure'))

var db = new PouchDB('mydb')

db.ensure({
  _id: 'a doc',
  value: 'a value'
})
  .then(doc => {
    // doc is saved and returned
    // doc === {_id: 'a doc', value: 'a value', _rev: '1-...'}

    return db.ensure({_id: 'a doc', value: 'a value'})
  })
  .then(doc => {
    // doc is just returned, not saved again
    // doc === {_id: 'a doc', value: 'a value', _rev: '1-...'}

    return db.ensure({_id: 'a doc', value: 'other value'})
  })
  .then(doc => {
    // doc is updated, now _rev is 2-... and value is 'other value'
  })
```
