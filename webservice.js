const express = require('express')
const directoryIndex = require('./directoryIndex')
const app = express()

directoryIndex.reIndex()

app.get('/directories/:key', function (req, res) {

    const indexEntry = directoryIndex.getIndexEntryForPath( req.params.key )
    if( indexEntry != undefined ) {
        res.json( mapResourceWithDepthCheck( 1 )( indexEntry ) )
    }
    else {
        res.status(404).json( { error: { code: 404, text: `Directory ${req.params.key} not found.`} } )
    }
})

function mapResourceWithDepthCheck( maxDepth,  depth = 0 ) {
  if( depth < maxDepth ) {
    const goDown = depth + 1
    return ( indexEntry ) => {
      return {
        name: indexEntry.name,
        path: indexEntry.path,
        type: indexEntry.type,
        subEntries: indexEntry.subEntries.map( mapResourceWithDepthCheck( maxDepth, goDown ) ),
        links: { 
          self: `http://localhost:3000/directories/${indexEntry.path}`,
          parent: `http://localhost:3000/directories/${indexEntry.parent.path}`
        }
      }
    }
  } else {
    return () => {}
  }
}

module.exports = app