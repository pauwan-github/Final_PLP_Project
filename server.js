// Importing, configuring and loading data from .env file
require('dotenv').config();

// Import packages or dependencies to be used
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const {check, validationRresult} = require('express-validator');
const port = process.env.PORT || 3100;

// Initialize an app by defining a variable to hold the app
const app = express();

// Set up session middle ware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false // explicitly provide this option
}));

// Connecting to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'new_user',
    password: 'new_password',
    database: 'signup'
});

// Access to the database
connection.connect((err) =>{
    if (err){
        console.error('Error connecting to mysql:' + err.stack);
        return;
    }
    // Print out
    console.log('Connected to Mysql');
});

// Set up middle ware static files to be used on the server. (scryypt and styling files)
app.use(express.static(__dirname));

// Set up middle ware that acts as the interface between the front end  and the backend
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.urlencoded({extended:true}));

// Setup routes
app.get('/',(req,res) =>{
    res.sendFile(__dirname + '/The Peoples Hospital.html');
})

// Set up sign up route
const User = {
    tableName: 'users',
    CreateUser: function(newUser, callback){

        // TO create a new user
        connection.query('INSERT INTO' + tableName + 'SET ?', newUser, callback);
    },

    // Email setup
    getUserByEmail: function(email, callback){
        connection.query('SELECT * FROM'+ this.tableName + 'WHERE email = ?', email, callback);
    },
    getUserByUsername: function(username,callback){
        connection.queery('SELECT * FROM' + this.tableName + 'WHERE username = ?', username,callback);
    }
};

// Define our sign up route
app.post('/signup', [
    check('email').isEmail(),
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),

    // Define custom validation
    check ('email').custom(async(value) =>{
        // Fetch new user
        const user = await User.getUserByEmail(value);

        // Checking for unique email
        if(user){
            throw new Error('Email already exists');
        }
    }),

    // Checking for unique username
    check('username').custom(async(value) =>{
        const user = await User.getUserByUsername(value);
        if(user){
            throw new Error('Username already exists');
        }
    }),

    // Definition of request handler
], async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // Hashing Passwords
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // News user object
    const newUser = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        full_name: req.body.full_name,
    }

    // Inserting new user into database
    user.createUser(newUser,(error, result, fields) => {
        if(error){
            console.error('Error inserting record:' + error.message);
            return res.status(500).json({error: error.message});
        }
        console.log('Record inserted.');
        res.status(201).json(newUser);
    });
});


// Define port and check if our connection to database is successful
const PORT = 3100;
app.listen(PORT, () =>{
    console.log('Server is running on port: $ {PORT}');
});