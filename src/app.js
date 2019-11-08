const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Rollbar = require("rollbar");
const favicon = require("serve-favicon");
const MongoStore = require("connect-mongo")(session);
const helmet = require("helmet");
const http = require("http").createServer(app);
const express_enforces_ssl = require("express-enforces-ssl");
const hostValidation = require("host-validation");

const db = require("./config/database");

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.enable("trust proxy");
app.use(express_enforces_ssl());
app.use(helmet());
app.use(favicon(path.join(__dirname, "public", "/img/favicon.ico")));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);
app.use(
  hostValidation({
    hosts: [
      "127.0.0.1:3000",
      `localhost:${app.get("port")}`,
      "wificar.herokuapp.com",
      /.*\.wificar\.herokuapp\.com$/
    ]
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
  environment: "development",
  captureUncaught: true,
  captureUnhandledRejections: true
});

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler());
rollbar.log("Hello world!");

//404
app.use((req, res, next) => {
  res.status(400).sendFile(path.join(__dirname, "public", "404.html"));
});

// Unhandled errors (500)
app.use(function(err, req, res, next) {
  console.error("An application error has occurred:");
  console.error(err);
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "public", "500.html"));
});

module.exports = { app, http };
//socket io
require("./config/socket");
