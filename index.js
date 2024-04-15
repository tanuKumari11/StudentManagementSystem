const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const breadcrumb = require('express-url-breadcrumb');

// Assuming these route files exist and are properly set up
const students = require('./routes/students');
const users = require('./routes/users');
const courses = require('./routes/courses');
const fees = require('./routes/fee-mgmt');
const api = require('./routes/api');
const uploads = require('./routes/uploads');

const app = express();

// Passport Configuration
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student-mgmt-sys', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Server...'))
.catch(err => console.error('Error occurred connecting to MongoDB...', err));

// Load Helpers
const { paginate, select, if_eq, select_course } = require('./helpers/customHelpers');
const { ensureAuthenticated, isLoggedIn } = require('./helpers/auth');

// Express Handlebars Middleware
app.engine('handlebars', exphbs.engine({
  helpers: {
    paginate,
    select,
    if_eq,
    select_course
  },
  defaultLayout: 'main' // Assuming 'main.handlebars' is your default layout
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express URL Breadcrumbs
app.use(breadcrumb());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware for PUT, DELETE methods in forms
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());
// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', [isLoggedIn], (req, res) => {
    res.render('home', {
        title: 'Welcome',
        layout: 'home'
    });
});

// Dashboard Route
app.get('/dashboard', [ensureAuthenticated], (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard'
    });
});

// Error Route
app.get('/errors', (req, res) => {
    res.render('errors', {
        title: '404 - Page Not Found.'
    });
});

// Use Routes
app.use('/students', students);
app.use('/users', users);
app.use('/courses', courses);
app.use('/fee-management', fees);
app.use('/api', api);
app.use('/uploads', uploads);

// Listening on Port
const port = process.env.PORT || 5000; // Fixed environment variable name and fallback port
app.listen(port, () => console.log(`Server started on port : ${port}`));
