const express = require ('express');
const morgan = require('morgan');
const path = require ('path');
const hbs = require ('express-handlebars');


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



//routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));

//statics files
app.use(express.static(path.join(__dirname, 'public')));




module.exports= app; 