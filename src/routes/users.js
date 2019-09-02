const Recaptcha = require('express-recaptcha').RecaptchaV3;
const { Router } = require("express");


const recaptcha = new Recaptcha(process.env.SITE_KEY, process.env.SECRET_KEY_RECAPTCHA ,{callback:'cb'});
const route = Router();

const { forwardAuthenticated, ensureAuthentication } = require("../helpers/auth");
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout
} = require("../controllers/userCtrl");

const { getForgot, postForgot, getReset, postReset } = require('../controllers/updatePasswCtrl');

route
  .route("/app/register")
  .get(forwardAuthenticated, getRegister)
  .post(postRegister);

route
  .route("/app/login")
  .get(forwardAuthenticated, getLogin)
  .post(postLogin);

route
.route("/app/forgot")
     .get(recaptcha.middleware.render,getForgot)
     .post(recaptcha.middleware.verify,postForgot);

route
.route('/app/reset/:token')
      .get( getReset)
      .post( postReset)
      
      

route.route("/logout").get(getLogout);

module.exports = route;
