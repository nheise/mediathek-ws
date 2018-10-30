const express = require('express')
const directoryIndex = require('./directoryIndex')
const settings = require('./settings')
const app = express()

const nothing = () => {}

directoryIndex.reIndex()

app.get('/directories/:key', function (req, res) {

    const indexEntry = directoryIndex.getIndexEntryForPath( req.params.key )
    if( indexEntry != undefined ) {
        res.json( mapToResourceBuilder( depthCheckBuilder( 1 ) )( indexEntry ) )
    }
    else {
        res.status(404).json( { error: { code: 404, text: `Directory ${req.params.key} not found.`} } )
    }
})

app.use('/files', express.static(settings.documentRoot) )

function depthCheckBuilder( maxDepth ) {
  let depth = -1
  return {
    next: ( mapper ) => {
      depth++
      return depth < maxDepth ? mapper : nothing
    }
  }
}

function mapToResourceBuilder( preDepthChecker ) {
  return function mapEntry( indexEntry ) {
    return {
      name: indexEntry.name,
      path: indexEntry.path,
      type: indexEntry.type,
      subEntries: indexEntry.subEntries.map( preDepthChecker.next( mapEntry ) ),
      links: { 
        self: `http://localhost:3000/directories/${indexEntry.path}`,
        parent: `http://localhost:3000/directories/${indexEntry.parent.path}`
      }
    }
  }
}

module.exports = app