const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method

    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Enter message</title>')
        res.write('<h1>Hello Liza Coca!</h1>')
        res.write('<body><form action="/message" method="POST">')
        res.write('<input type="text" name="message">')
        res.write('<button>Send</button></form></body>')
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
 
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
            
            console.log('Body: ' + body)
            console.log('ParsedBody: ' + parsedBody)
            console.log('Message: ' + message)
        })
    }
}

// module.exports = requestHandler

// module.exports.handler = requestHandler
// module.exports.someText = 'Liza coca'

// exports.handler = requestHandler
// exports.someText = 'Liza coca'

module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text.'
}
