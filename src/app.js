const express = require ('express');
const morgan = require('morgan');
const path = require ('path');
const hbs = require ('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');


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

//passport
// passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));

//statics files
app.use(express.static(path.join(__dirname, 'public')));




module.exports= app; 