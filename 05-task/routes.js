const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method

    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Add user</title>')
        res.write('<h1>Welcome to Node.js</h1>')
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button>Add user</button></form></body>')
        res.write('</html>')
        res.end()
    }
    
    if (url === '/users' && method === 'GET') {
        res.write('<html>')
        res.write('<head><title>Users</title>')
        res.write('<h1>Users</h1>')
        res.write('<ul>')
        res.write('<li>Susan Taylor</li>')
        res.write('<li>Keith Smith</li>')
        res.write('<li>Molly Parton</li>')
        res.write('</html>')
        res.end()
    }

    if (url === '/create-user' && method === 'POST') {
        const body = []
    
        req.on('data', (chunk) => {
            body.push(chunk)
        })
    
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const username = parsedBody.split('=')[1]
        
            console.log('Username: ' + username)

            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        })
    }
}

module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text.'
}
