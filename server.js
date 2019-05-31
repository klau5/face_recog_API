const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex') 

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'klau5',
        password: '',
        database: 'face_recog'
    }
});

db.select('*').from('users');

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
            res.json(database.users[0]);
    } else {
        res.status(400).json('Error Logging In');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db('users').returning('*').insert({
       name: name,
       email: email,
       joined: new Date()
    })
     .then(response => {
        res.json(response);
     })
     .catch(err => res.status(400).json('Unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        console.log(user);
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