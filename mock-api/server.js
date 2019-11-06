const express = require('express')
const cors = require('cors')

const port = '3000'
const app = express()
app.use(cors())

// coffe endpoint
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

app.listen(port, () => console.log(`Mock server listening on port ${port}!`))
