const fs = require('fs')
const path = require('path')
const { documentRoot } = require('./settings')

let index = {}


function reIndex() {
  index = {}
  // doIfDirectory( path.resolve( documentRoot ), readPath )
  // readDir( documentRoot )
  readStats( path.resolve( documentRoot ) )
}

function readStats( directoryEntry ) {
  fs.stat( directoryEntry, (error, stats) => {
    if( stats.isDirectory() ){
      console.log( 'isDirectory' )
      console.log( '->' + directoryEntry )
      console.log( '->' + path.relative( documentRoot, directoryEntry ) )
      readDir( directoryEntry )
    }
    else if( stats.isFile() ) {
      console.log( 'isFile' )
      console.log( '->' + directoryEntry )
      console.log( '->' + path.relative( documentRoot, directoryEntry ) )
    }
  })
}

function readDir( directory ) {
  fs.readdir( directory, (error, directoryEntrys) => {
    directoryEntrys.forEach( directoryEntry => {
      readStats( path.resolve( directory, directoryEntry ) )
    })
  })
}

module.exports = {
  reIndex: reIndex
}