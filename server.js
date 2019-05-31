const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex') 
const bcrypt = require('bcrypt');

/// Knex:- DB handler
/// Remember to change User when switching platforms

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',   /// klau5 on Mac and postgres on Windows
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

/// signin existing user

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json('Error Logging In');
    }
})

/// Register a new user

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
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

/// search user by :id

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User not found')
        } 
    })
    .catch(err => res.status(400).json('Erro getting user'))
})

/// Update entries based on number of images submitted

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]); 
    })
    .catch(err => res.status(400).json('Unable to get entries'))
}) 

/// check if server is running

app.listen(3000, () => {
    console.log('app is running');
})