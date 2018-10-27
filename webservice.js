const express = require('express')
const directoryIndex = require('./directoryIndex')
const app = express()

directoryIndex.reIndex()

app.get('/directories/:key', function (req, res) {

    const indexEntry = directoryIndex.getIndexEntryForPath( req.params.key )
    if( indexEntry != undefined ) {
        res.json( mapToResource( 0 )( indexEntry ) )
    }
    else {
        res.status(404).json( { error: { code: 404, text: `Directory ${req.params.key} not found.`} } )
    }
})

function mapToResource( depth = 0 ) {
  if( depth > 1 ) {
    return () => {}
  } else {
    return ( indexEntry ) => {
      return {
        name: indexEntry.name,
        path: indexEntry.path,
        type: indexEntry.type,
        subEntries: indexEntry.subEntries.map( mapToResource( ++depth ) ),
        links: { 
          self: `http://localhost:3000/directories/${indexEntry.path}`,
          parent: `http://localhost:3000/directories/${indexEntry.parent.path}`
        }
      }
    }
  }
}

module.exports = app