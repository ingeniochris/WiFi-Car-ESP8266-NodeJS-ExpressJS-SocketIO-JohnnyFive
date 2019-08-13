const express = require ('express');
const morgan = require('morgan');
const path = require ('path');






//instancia
const app = express();




//settings
app.set('port', process.env.PORT);
app.set(morgan('tiny'));
app.set('views', path.join(__dirname, 'views'));




//middlewares



//routes



//statics files





module.exports= app; 