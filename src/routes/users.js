const { Router } = require("express");
const route = Router();

const { forwardAuthenticated } = require("../helpers/auth");
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout
} = require("../controllers/userCtrl");

const { getForgot, postForgot } = require('../controllers/updatePasswCtrl');

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
     .get(getForgot)
     .post(postForgot);

route
.route('/app/reset')
      .get((req,res)=> res.render('users/reset'))     

route.route("/logout").get(getLogout);

module.exports = route;
