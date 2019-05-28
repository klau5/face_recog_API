const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '456',
            name: 'klau5',
            email: 'klau5@gmail.com',
            password: 'awesome',
            entries: 0,
            joined: new Date()
        },
        {
            id: '890',
            name: 'arya',
            email: 'arya@gmail.com',
            password: 'thenorth',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('Login Successfuul');
    } else {
        res.status(400).json('Error Logging In');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: '234',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('User not found');
    }
})

app.put('/image', (req, res) => {
    const {id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('entry not found');
    }
})

app.listen(3000, () => {
    console.log('app is running');
})