const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set views folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes using res.render
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/courses', (req, res) => {
    res.render('courses');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/playlist', (req, res) => {
    res.render('playlist');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/watch-video', (req, res) => {
    res.render('watch-video');
});

app.get('/teachers', (req, res) => {
    res.render('teachers');
});

app.get('/teacher_profile', (req, res) => {
    res.render('teacher_profile');
});

app.get('/update', (req, res) => {
    res.render('update');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
