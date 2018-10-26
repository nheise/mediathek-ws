const fs = require('fs')
const path = require('path')
const { documentRoot } = require('./settings')
const documentRootAbsolutePath = path.resolve( documentRoot )
const type = {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY'
}

let index = {}

function getIndexEntryForPath( path ) {
  return index[ path ]
}

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

function reIndex() {
  index = {}
  
  const rootIndexEntry = createIndexEntry( '', '', documentRootAbsolutePath )
  rootIndexEntry.type = type.DIRECTORY
  
  index[''] = rootIndexEntry

  readDirectory( rootIndexEntry )
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
      index[relativePathToDocumentRoot] = subIndexEntry
      
      readStats( subIndexEntry )
    })
  })
}

module.exports = {
  getIndexEntryForPath: getIndexEntryForPath,
  reIndex: reIndex,
  size: () => Object.keys(index).length,
  entryType: type
}