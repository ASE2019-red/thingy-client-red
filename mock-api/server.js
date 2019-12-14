const express = require('express')
const http = require('http')
const cors = require('cors')
const port = '3000'
const app = express()
const server = http.Server(app)
const expressWs = require('express-ws')(app);
const bodyParser = require('body-parser');

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOTFiYTZlZmQtMmU1NC00NTA3LTkzNmYtMDZmNmNhYmM3MGU4IiwibmFtZSI6IlVzZXIgMSIsImVtYWlsIjoidXNlcjFAdGVzdC5jaCJ9LCJpYXQiOjE1NzYxMDM0Mzl9.bgipOg3tC25ydggOqdAUPIGPLR0Jbvsy5y23fYZzctg";
const users = require('./mocks/all-users.json');

app.use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

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

// user endpoint
app.get('/user', (req, res) => {
    res.send(users)
})

app.get('/user/:userId', (req, res) => {
    const userId = parseInt(req.params['userId'])
    const user = users[userId];
    res.send(user)
})

app.post('/user', (req, res) => {
    let user = {
        "id": users.length,
        "name": req.body.name,
        "email": req.body.email,
        "hashedPassword": req.body.psw,
        "active": true,
        "machines": []
    };
    users.push(user);
    user["token"]=JWT_TOKEN;
    res.send(user);
})

app.delete('/user/:userId', (req, res) => {
    res.sendStatus(204);
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.psw;
    let user;
    for (let el of users) {
        if (el.email == email) {
            user = el;
            break;
        }
    }
    if (user.hashedPassword === password) {
        user["token"]=JWT_TOKEN;
        console.log("Login user:", user);
        res.send(user);
    }
    else {
        res.statusMessage = "Authentication failed";
        res.sendStatus(401);
    }
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

function randomFloat() {
    const min=0;
    const max=5;
    return Math.random() * ( +max - +min ) + +min;
}

app.listen(port, () => console.log(`Mock server listening on port ${port}!`))
