const o = require('ospec')
const settings = require('../settings')
settings.documentRoot = 'tests/dirs'

const directoryIndex = require('../directoryIndex')

o.spec('directoryIndex', function () {

  o("must index test dir", function ( done ) {
    o.timeout(7000)
    
    directoryIndex.reIndex()

    const interval = setInterval( () => {

      if( directoryIndex.size() == 7 ) {

        const dir1Entry = directoryIndex.getIndexEntryForPath( 'dir1' )
        o( dir1Entry.name ).equals( 'dir1' )
        o( dir1Entry.type ).equals( directoryIndex.entryType.DIRECTORY )
        o( dir1Entry.subEntries.length ).equals( 2 )
        o( dir1Entry.parent.name ).equals( '' )
        
        const file11Entry = directoryIndex.getIndexEntryForPath( 'dir1/dir11/file11' )
        o( file11Entry.name ).equals( 'file11' )
        o( file11Entry.type ).equals( directoryIndex.entryType.FILE )
        o( file11Entry.subEntries.length ).equals( 0 )
        o( file11Entry.size ).equals( 10 )
        o( file11Entry.parent.name ).equals( 'dir11' )

        clearInterval( interval )
        done()
      }

    }, 1000 )
  })

})