const express = require("express");
const path = require("path");
const port = 3000;
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// stuff related to express
app.use('/static', express.static('static')); // for serving static files 
app.use(express.urlencoded({ extended: true }));

// stuff related to mongo
mongoose.connect("mongodb://localhost:27017/myusers", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

// define mongodb user schema    
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema); // Use 'User' for model name

// pug specific stuff I mean setting view engine as pug 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// routes
app.get('/', (req, res) => {
    res.status(200).render('signin.pug');
});

app.get('/signup', (req, res) => {
    res.status(200).render('signup.pug');
});

// Sign up endpoint
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new User({ email, password }); // Use 'User' instead of 'user'
        await newUser.save();
        res.status(201).send("User created successfully!");
    } catch (err) {
        res.status(400).send("Error creating user");
    }
});

// Sign in endpoint
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.status(200).send("Login successful!");
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// start the server
app.listen(port, () => {
    console.log(`the application successfully started on ${port}`);
});
