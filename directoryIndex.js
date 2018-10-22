const fs = require('fs')
const path = require('path')
const { documentRoot } = require('./settings')

let index = {}


function reIndex() {
  index = {}
  doIfDirectory( path.resolve( documentRoot ), readPath )
}

function readPath( error, directory ) {
      //const pathIndex = []
      console.log( directory )
      fs.readdir( directory, (error, files) => {
        files.forEach( file => {
          const subDir = path.resolve( directory, file )
          console.log( '->' + subDir )
          doIfDirectory( subDir, readPath )
        })
      })
      console.log('###')
}

function doIfDirectory( directory, callback ) {
  fs.stat( directory, (error, stats) => {
    if( stats.isDirectory() ){
      callback( error, directory )
    }
  })
}

module.exports = {
  reIndex: reIndex
}