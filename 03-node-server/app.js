const http = require('http')
const fs = require('fs')

/*
function rqListener(req, res) {
    console.log(req)
}

http.createServer(rqListener)
*/

/*
http.createServer(function(req, res){
    console.log(req)
})
*/

const server = http.createServer((req, res) => {
    // console.log(req)
    // console.log(req.url, req.method, req.headers)
    const url = req.url
    const method = req.method

    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Enter message</title>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button>Send</button></form></body>')
        res.write('</html>')
        return res.end()
    }

    if (url === '/message' && method === 'POST') {
        const body = []

        req.on('data', (chunk) => {
            console.log('Chunk: ' + chunk)
            body.push(chunk)
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split('=')[1]
            fs.writeFileSync('message.txt', message);
            console.log('Body: ' + body)
            console.log('ParsedBody: ' + parsedBody)
            console.log('Message: ' + message)
        })

        res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<h1>Liza is here!</h1>')
    res.write('</html>')
    res.end()

    console.log(url)

    // console.log(res)
    // process.exit()
})

server.listen(3000)