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
              o( indexEntry.subEntries.length ).equals( 2 )
              o( indexEntry.subEntries[0].name ).equals( 'dir11' )
              o( indexEntry.subEntries[0].subEntries.length ).equals( 0 )
              console.log( indexEntry.subEntries )
            });
            res.on('end', () => {
                done();
            })
        })

        req.end()
    })
    
    o("GET /files", function (done) {
        
        const options = { hostname: 'localhost', port: PORT, path: '/mediathek/files/dir1/file1', method: 'GET' };

        const req = http.request(options, (res) => {
            o(res.statusCode).equals(200)
            o(res.headers["content-type"]).equals("application/octet-stream")

            res.on('data', (chunk) => {
              o( chunk.toString('utf-8') ).equals( 'Hallo' )
            });
            res.on('end', () => {
                done();
            })
        })

        req.end()
    })

    o("GET /files range request", function (done) {
        
        const options = { hostname: 'localhost', port: PORT, path: '/mediathek/files/dir1/file1', method: 'GET',
            headers: { range: 'bytes=3-' }
        };

        const req = http.request(options, (res) => {
            o(res.statusCode).equals(206)
            o(res.headers["content-type"]).equals("application/octet-stream")
            
            res.on('data', (chunk) => {
              o( chunk.toString('utf-8') ).equals( 'lo' )
            });
            res.on('end', () => {
                done();
            })
        })

        req.end()
    })

})