const express = require('express')
const http = require('http')
const socket = require('socket.io')
const cors = require('cors')

const port = '3000'
const app = express()
const server = http.Server(app)
const io = socket(server, { origins: '*:*'})
app.use(cors())

// coffee endpoint
app.get('/coffee', (req, res) => {
    res.send(require('./mocks/all-coffees.json'))
})

app.get('/coffee/:coffeeId', (req, res) => {
    const coffees = require('./mocks/all-coffees.json')
    const coffee = coffees[0]
    coffee['id'] = parseInt(req.params['coffeeId'])
    res.send(coffee)
})

app.post('/coffee', (req, res) => {
    res.sendStatus(204);
})

app.delete('/coffee/:coffeeId', (req, res) => {
    res.sendStatus(204);
})

// machine endpoint
app.get('/machine', (req, res) => {
    res.send(require('./mocks/all-machines.json'))
})

app.get('/machine/:machineId/coffee', (req, res) => {
    const coffees = require('./mocks/all-coffees.json')
    res.send(''+coffees.length)
})

app.post('/machine', (req, res) => {
    res.sendStatus(204);
})

app.delete('/machine/:machineId', (req, res) => {
    res.sendStatus(204);
})

app.get('/wstest', (req, res) => {
    res.sendFile(__dirname + '/wstest.html')
})

io.of('/measurements/live/gravity')
    .on('connection', (socket) => {
        const stream = setInterval(() => {
            const x = randomFloat()
            const y = randomFloat()
            const z = randomFloat()
            socket.volatile.emit('data', [x, y, z])
        }, 1000)

        socket.on('disconnect', () => {
            clearInterval(stream)
        })
    })

function randomFloat() {
    const min=0;
    const max=5;
    return Math.random() * ( +max - +min ) + +min;
}

server.listen(port, () => console.log(`Mock server listening on port ${port}!`))
