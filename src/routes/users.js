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

route
  .route("/app/register")
  .get(forwardAuthenticated, getRegister)
  .post(postRegister);

route
  .route("/app/login")
  .get(forwardAuthenticated, getLogin)
  .post(postLogin);

route.route("/logout").get(getLogout);

module.exports = route;
