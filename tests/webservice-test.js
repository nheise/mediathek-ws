const o = require('ospec');
const settings = require('../settings')
settings.documentRoot = 'tests/dirs'
const webservice = require('../webservice')
const express = require('express')
const http = require("http")

const PORT = 3000
const app = express()

app.use( '/mediathek', webservice )

const server = app.listen(PORT, function () {
    console.log(`Test server runs on port ${PORT}!`);
})

o.spec('webservice', function () {

    o.after(() => server.close())

    o("GET /directories/:key", function (done) {
        
        const options = { hostname: 'localhost', port: PORT, path: '/mediathek/directories/dir1', method: 'GET' };

        const req = http.request(options, (res) => {
            o(res.statusCode).equals(200)
            o(res.headers["content-type"]).equals("application/json; charset=utf-8")

            res.setEncoding('utf8')

            res.on('data', (chunk) => {
              const indexEntry = JSON.parse( chunk )
              o( indexEntry.name ).equals( 'dir1' )
              o( indexEntry.path ).equals( 'dir1' )
              o( indexEntry.type ).equals( 'DIRECTORY' )
              o( indexEntry.links.self ).equals( 'http://localhost:3000/directories/dir1' )
              o( indexEntry.links.parent ).equals( 'http://localhost:3000/directories/' )
            });
            res.on('end', () => {
                done();
            })
        })

        req.end()
    })

})