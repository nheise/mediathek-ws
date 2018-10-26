const o = require('ospec')
const settings = require('../settings')
settings.documentRoot = 'tests/dirs'

const directoryIndex = require('../directoryIndex')

o.spec('directoryIndex', function () {

  o("must index test dir", function ( done ) {
    o.timeout(7000)
    
    directoryIndex.reIndex()

    const interval = setInterval( () => {
      const indexKeys = Object.keys( directoryIndex.index )
      
      if( indexKeys.length == 7 ) {
        // console.log( indexKeys )

        const dir1Entry = directoryIndex.index['dir1']
        o( dir1Entry.type ).equals( 'DIRECTORY' )
        o( dir1Entry.subEntrys.length ).equals( 2 )
        o( dir1Entry.parent.name ).equals( '' )
        
        const file11Entry = directoryIndex.index['dir1/dir11/file11']
        o( file11Entry.type ).equals( 'FILE' )
        o( file11Entry.subEntrys.length ).equals( 0 )
        o( file11Entry.size ).equals( 0 )
        o( file11Entry.parent.name ).equals( 'dir11' )

        clearInterval( interval )
        done()
      }

    }, 1000 )
  })

})