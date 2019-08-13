const express = require ('express');
const morgan = require('morgan');
const path = require ('path');
const hbs = require ('express-handlebars');


//instances
const app = express();
const views = app.get('views');



//settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    layoutsDir: path.join(views, 'layouts'),
    partialsDir: path.join(views, 'partials'),
    defaultLayout: 'main',
    extname: 'hbs'
}));



//middlewares
app.use(morgan('tiny'));



//routes



//statics files





module.exports= app; 