const express = require("express");
const morgan = require("morgan");
const path = require("path");
const hbs = require("express-handlebars");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const Rollbar = require("rollbar");

//instances
const app = express();

//settings
app.set("port", process.env.PORT);
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: "hbs"
  })
);
app.set("view engine", "hbs");

//middlewares
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Diynamic",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//routes
app.use(require("./routes/index"));
app.use(require("./routes/users"));
app.use(require("./routes/control"));

//statics files
app.use(express.static(path.join(__dirname, "public")));

//Rollbar  Dev 
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR,
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

module.exports = app;
