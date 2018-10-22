const o = require('ospec')
const settings = require('../settings')
settings.documentRoot = 'tests/dirs'

const directoryIndex = require('../directoryIndex')

o.spec('directoryIndex', function () {

  o("must index test dir", function () {
    directoryIndex.reIndex()
  })

})