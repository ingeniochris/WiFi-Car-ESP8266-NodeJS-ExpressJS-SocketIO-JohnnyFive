const { Router } = require("express");
const route = Router();

const { forwardAuthenticated } = require("../helpers/auth");
const { getIndex, getAbout } = require("../controllers/indexCtrl");

route.route("/").get(forwardAuthenticated, getIndex);

route.route("/about").get(getAbout);

module.exports = route;
