const fs = require('fs')
const path = require('path')
const { documentRoot } = require('./settings')
const documentRootAbsolutePath = path.resolve( documentRoot )
const type = {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY'
}

const directoryIndex = {}
directoryIndex.index = {}

function createIndexEntry( name, path, absolutePath ) {
  return {
    name: name,
    path: path,
    absolutePath: absolutePath,
    parent: null,
    subEntrys: [],
    addFileStats: function(stats) {
      this.size = stats.size
      this.type = type.FILE
    },
    addDirectoryStats: function(stats) {
      this.type = type.DIRECTORY
    }
  }
}

directoryIndex.reIndex = function reIndex() {
  directoryIndex.index = {}
  directoryIndex.index[''] = createIndexEntry( '', '', documentRootAbsolutePath )
  directoryIndex.index[''].type = type.DIRECTORY

  readDirectory( directoryIndex.index[''] )
}

function readStats( indexEntry ) {
  fs.stat( indexEntry.absolutePath, (error, stats) => {
    if( stats.isDirectory() ){
      indexEntry.addDirectoryStats( stats )
      readDirectory( indexEntry )
    }
    else if( stats.isFile() ) {
      indexEntry.addFileStats( stats )
    }
  })
}

function readDirectory( indexEntry ) {
  fs.readdir( indexEntry.absolutePath, (error, directoryEntrys) => {
    directoryEntrys.forEach( directoryEntry => {
      const absolutePathToDocumentRoot = path.resolve( indexEntry.absolutePath, directoryEntry )
      const relativePathToDocumentRoot = path.relative( documentRootAbsolutePath, absolutePathToDocumentRoot )
      
      const subIndexEntry = createIndexEntry( directoryEntry, relativePathToDocumentRoot, absolutePathToDocumentRoot )
      
      indexEntry.subEntrys.push( subIndexEntry )
      subIndexEntry.parent = indexEntry
      directoryIndex.index[relativePathToDocumentRoot] = subIndexEntry
      
      readStats( subIndexEntry )
    })
  })
}

module.exports = directoryIndex