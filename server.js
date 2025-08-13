const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set views folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make user data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }
    next();
};

// Mock data for testing
const mockData = {
    stats: {
        courses: '+10k',
        students: '+40k',
        tutors: '+2k',
        placement: '100%'
    },
    reviews: [
        {
            comment: "StudyBridge made tough engineering topics feel simple. The structured roadmap kept me on track, and the projects helped me apply what I learned.",
            studentName: "Aarav S.",
            studentImage: "images/pic-2.jpg",
            rating: 4.5
        },
        {
            comment: "I love how interactive and clean the platform is. It's like having a personal mentor, but online!",
            studentName: "Meera K.",
            studentImage: "images/pic-3.jpg",
            rating: 5
        }
    ],
    courses: [
        {
            id: 1,
            title: "Complete DSA Tutorial",
            tutorName: "Asav Mahyavanshi",
            tutorImage: "images/asav2.jpg",
            tutorRole: "Web Developer",
            date: "21-10-2022",
            thumbnail: "images/dsa.png",
            videoCount: 6,
            description: "Master Data Structures and Algorithms with practical examples",
            category: "development",
            topics: ["dsa", "algorithms", "programming"]
        },
        {
            id: 2,
            title: "Complete CSS Tutorial",
            tutorName: "Sakhee Mate",
            tutorImage: "images/sakhee.jpg",
            tutorRole: "Frontend Developer",
            date: "11-3-2025",
            thumbnail: "images/thumb-2.png",
            videoCount: 9,
            description: "Master CSS styling and create beautiful, responsive web designs",
            category: "development",
            topics: ["css", "web-design", "frontend"]
        }
    ],
    playlists: {
        1: [
            {
                id: 1,
                title: "Introduction to DSA (part 01)",
                description: "Learn the fundamentals of Data Structures and Algorithms",
                videoUrl: "https://www.youtube.com/embed/VTLCoHnyACE",
                thumbnail: "images/dsa.png",
                date: "21-10-2022",
                duration: "10:30",
                likes: 44
            },
            {
                id: 2,
                title: "Arrays and Linked Lists (part 02)",
                description: "Master Arrays and Linked Lists with practical examples",
                videoUrl: "https://www.youtube.com/embed/VTLCoHnyACE",
                thumbnail: "images/dsa.png",
                date: "22-10-2022",
                duration: "15:45",
                likes: 32
            }
        ],
        2: [
            {
                id: 1,
                title: "CSS Basics and Selectors (part 01)",
                description: "Learn the basics of CSS and selectors",
                videoUrl: "https://www.youtube.com/embed/VTLCoHnyACE",
                thumbnail: "images/thumb-2.png",
                date: "11-3-2025",
                duration: "12:20",
                likes: 28
            },
            {
                id: 2,
                title: "Box Model and Layout (part 02)",
                description: "Master the CSS Box Model and Layout techniques",
                videoUrl: "https://www.youtube.com/embed/VTLCoHnyACE",
                thumbnail: "images/thumb-2.png",
                date: "12-3-2025",
                duration: "18:30",
                likes: 35
            }
        ]
    }
};

// Array to store user credentials
const userCredentials = [
    {
        email: 'sakheemate@gmail.com',
        password: 'ui23cs39',
        name: 'Sakhee Mate',
        role: 'Teacher',
        profile_pic: 'images/sakhee.jpg'
    },
    {
        email: 'asav@gmail.com',
        password: 'ui23cs38',
        name: 'Asav Mahyavanshi',
        role: 'Teacher',
        profile_pic: 'images/asav2.jpg'
    },
    {
        email: 'dudi@gmail.com',
        password: 'ui23cs05',
        name: 'Aman Dudi',
        role: 'Teacher',
        profile_pic: 'images/dudi.jpg'
    }
];

// Main routes
app.get('/', (req, res) => {
    res.render('pages/home', { 
        user: req.session.user,
        likes: 25,
        comments: 12,
        playlists: 4
    });
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/about', (req, res) => {
    res.render('pages/about', { 
        user: req.session.user,
        stats: mockData.stats,
        reviews: mockData.reviews
    });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { user: req.session.user });
});

// Authentication routes
app.get('/login', (req, res) => {
    res.render('auth/login', { user: req.session.user });
});

app.get('/register', (req, res) => {
    res.render('auth/register', { user: req.session.user });
});

// Course routes
app.get('/courses', (req, res) => {
    const { category, topic } = req.query;
    let filteredCourses = mockData.courses;

    if (category) {
        filteredCourses = filteredCourses.filter(course => 
            course.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (topic) {
        filteredCourses = filteredCourses.filter(course => 
            course.topics.includes(topic.toLowerCase())
        );
    }

    res.render('courses/courses', { 
        user: req.session.user,
        courses: filteredCourses
    });
});

// Teacher routes
app.get('/teachers', (req, res) => {
    res.render('teachers/teachers', { user: req.session.user });
});

app.get('/teacher-profile', (req, res) => {
    res.render('teacher-profiles/teacher_profile', { user: req.session.user });
});

// Playlist routes
app.get('/playlist', (req, res) => {
    res.render('playlists/playlist', { user: req.session.user });
});

app.get('/playlist/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = mockData.courses.find(c => c.id === courseId);
    const playlist = mockData.playlists[courseId];

    if (!course || !playlist) {
        return res.status(404).render('error', { 
            message: 'Playlist not found',
            user: req.session.user
        });
    }

    res.render('playlists/playlist-detail', {
        user: req.session.user,
        course,
        playlist
    });
});

// Individual playlist routes
app.get('/playlist1', (req, res) => {
    res.render('playlists/playlist1', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist2', (req, res) => {
    res.render('playlists/playlist2', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist3', (req, res) => {
    res.render('playlists/playlist3', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist4', (req, res) => {
    res.render('playlists/playlist4', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist5', (req, res) => {
    res.render('playlists/playlist5', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist6', (req, res) => {
    res.render('playlists/playlist6', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist7', (req, res) => {
    res.render('playlists/playlist7', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

app.get('/playlist8', (req, res) => {
    res.render('playlists/playlist8', { 
        user: req.session.user,
        courses: mockData.courses
    });
});

// Teacher profile routes
app.get('/teacher-profile1', (req, res) => {
    res.render('teacher-profiles/teacher-profile1', { user: req.session.user });
});

app.get('/teacher-profile2', (req, res) => {
    res.render('teacher-profiles/teacher-profile2', { user: req.session.user });
});

app.get('/teacher-profile3', (req, res) => {
    res.render('teacher-profiles/teacher-profile3', { user: req.session.user });
});

app.get('/teacher-profile4', (req, res) => {
    res.render('teacher-profiles/teacher-profile4', { user: req.session.user });
});

app.get('/teacher-profile5', (req, res) => {
    res.render('teacher-profiles/teacher-profile5', { user: req.session.user });
});

app.get('/teacher-profile6', (req, res) => {
    res.render('teacher-profiles/teacher-profile6', { user: req.session.user });
});

app.get('/teacher-profile7', (req, res) => {
    res.render('teacher-profiles/teacher-profile7', { user: req.session.user });
});

app.get('/teacher-profile8', (req, res) => {
    res.render('teacher-profiles/teacher-profile8', { user: req.session.user });
});

// Protected routes
app.get('/profile', requireAuth, (req, res) => {
    res.render('profile', { user: req.session.user });
});

app.get('/watch-video/:id', requireAuth, (req, res) => {
    const videoId = parseInt(req.params.id);
    let video = null;
    let course = null;

    for (const [courseId, playlist] of Object.entries(mockData.playlists)) {
        const foundVideo = playlist.find(v => v.id === videoId);
        if (foundVideo) {
            video = foundVideo;
            course = mockData.courses.find(c => c.id === parseInt(courseId));
            break;
        }
    }

    if (!video || !course) {
        return res.status(404).render('error', { 
            message: 'Video not found',
            user: req.session.user
        });
    }

    res.render('watch-video', { 
        user: req.session.user,
        video,
        course
    });
});

app.get('/update', requireAuth, (req, res) => {
    res.render('update', { user: req.session.user });
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Find user in credentials array
    const user = userCredentials.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session with profile picture
        req.session.user = {
            name: user.name,
            email: user.email,
            role: user.role,
            profile_pic: user.profile_pic
        };
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Guest login route
app.post('/api/guest-login', (req, res) => {
    req.session.user = {
        name: 'Guest',
        role: 'Student',
        profile_pic: 'images/pic-1.jpg'
    };
    res.redirect('/');
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Profile update route
app.post('/api/update-profile', requireAuth, (req, res) => {
    const { name, email, old_pass, new_pass, c_pass } = req.body;
    const profile_pic = req.files ? req.files.profile_pic : null;

    // Validate password if changing
    if (new_pass) {
        if (new_pass !== c_pass) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }
        if (old_pass !== req.session.user.password) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
    }

    // Update user data
    const updatedUser = {
        ...req.session.user,
        name: name || req.session.user.name,
        email: email || req.session.user.email,
        password: new_pass || req.session.user.password
    };

    // Handle profile picture if uploaded
    if (profile_pic) {
        const uploadPath = path.join(__dirname, 'public', 'images', 'profile_pics', profile_pic.name);
        profile_pic.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error uploading profile picture' });
            }
            updatedUser.profile_pic = `/images/profile_pics/${profile_pic.name}`;
            req.session.user = updatedUser;
            res.json({ success: true, message: 'Profile updated successfully' });
        });
    } else {
        req.session.user = updatedUser;
        res.json({ success: true, message: 'Profile updated successfully' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        user: req.session.user
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        user: req.session.user
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
