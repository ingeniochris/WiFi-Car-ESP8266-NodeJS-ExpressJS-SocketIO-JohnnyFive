const express = require ('express');
const morgan = require('morgan');
const path = require ('path');
const hbs = require ('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


//instances
const app = express();


//settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');



//middlewares
app.use(morgan('tiny'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'Diynamic',
    resave: true,
    saveUninitialized: true
  }));

//passport
// passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/control'));

//statics files
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });


module.exports= app; 