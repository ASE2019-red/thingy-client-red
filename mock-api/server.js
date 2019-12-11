const express = require('express')
const http = require('http')
const cors = require('cors')
const port = '3000'
const app = express()
const server = http.Server(app)
const expressWs = require('express-ws')(app);
const bodyParser = require('body-parser');
app.use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

// non-persistent store
const machineStore = require('./mocks/all-machines.json')

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
    console.log(machineStore)
    res.send(machineStore)
})

app.get('/machine/:machineId/coffee', (req, res) => {
    const coffees = require('./mocks/all-coffees.json')
    res.send(''+coffees.length)
})

app.post('/machine', (req, res) => {
    const id = Math.random().toString(26).slice(2)
    const name = req.body.name
    const sensorIdentifier = req.body.sensorIdentifier
    const maintenanceThreshold = req.body.maintenanceThreshold
    const active = true
    const machine = {id, name, sensorIdentifier, active, maintenanceThreshold}
    machineStore.push(machine)
    res.send(machine)
})

app.delete('/machine/:machineId', (req, res) => {
    res.sendStatus(204);
})

// measurements endpoint
app.get('/measurements', (req, res) => {
    const measurements = [{name: "gravity"},{name: "sound"},{name: "test_m"}]
    res.send(measurements);
})

app.get('/measurements/:id', (req, res) => {
    const data = require('./mocks/gravity-measurements.json')
    res.send(data);
})

app.get('/wstest', (req, res) => {
    res.sendFile(__dirname + '/wstest.html')
})

app.ws('/measurements/live/gravity', (ws, req) => {
        const stream = setInterval(() => {
            const data = {
                time: "1970-01-01T00:00:00.000Z",
                sum_x: randomFloat(),
                sum_y: randomFloat(),
                sum_z: randomFloat()
            }
            ws.send(JSON.stringify([data]))
        }, 1000)
        ws.on('error', () => {
            clearInterval(stream)
        })
        ws.on('close', () => {
            clearInterval(stream)
        })
})

app.ws('/machine/calibration', (ws, req) => {

    setTimeout(() => {
        ws.close(1000, 'timeout');
    }, 31000)

    ws.on('message', msg => {
        const data = JSON.parse(msg);
        if (!data['id']) {
            ws.close(1008, 'No machine specified.')
        }
        const machineExists = machineStore.find(m => m.id == data['id'])
        if (machineExists) {
            const answer = {calibrating: true, limit: 30}
            ws.send(JSON.stringify(answer))
        } else {
            ws.close(1008, 'Machine does not exist.')
        }
    })
    ws.on('error', () => {
        console.log('error: calibration aborted')
    })
    ws.on('close', (event) => {
        console.log(event)
        console.log(`calibration aborted: ${event.reason}`)
    })
})

function randomFloat() {
    const min=0;
    const max=5;
    return Math.random() * ( +max - +min ) + +min;
}

app.listen(port, () => console.log(`Mock server listening on port ${port}!`))
