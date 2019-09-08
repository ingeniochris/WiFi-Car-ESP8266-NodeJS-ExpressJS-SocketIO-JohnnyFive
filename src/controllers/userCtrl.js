const bcrypt = require("bcryptjs");
const passport = require("passport");
const validator = require('validator');

const User = require("../models/userModel");

const userCtrl = {};

userCtrl.getRegister = (req, res, next) => {
  res.render("users/register");
};

userCtrl.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];



  if(!validator.isLength(name,{min:4})) errors.push({text:'Ingresa un nombre de almenos 4 letras'});
  if(!validator.isLength(name,{max:20})) errors.push({text:'Intenta con un nombre mas corto'});
  if (!validator.isEmail(email)) errors.push({ text: "Ingresa un email valido." });
  if(!validator.isLength(password,{min:8})) errors.push({text:'Por su seguridad se recomienda un password de 8 digitos'});
  if(!validator.isLength(password,{max:20})) errors.push({text:'Intenta con un password menor a 20 digitos'});

  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  } else {
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error_msg", "Este email ya se encuentra registrado");
      res.redirect("/app/register");
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      await newUser.save();
      req.flash(
        "success_msg",
        "Registrado puedes iniciar sesión"
      );
      await res.redirect("/app/login");
    }
  }
};

userCtrl.getLogin = (req, res) => {
  res.render("users/login");
};

userCtrl.postLogin = (req, res, next) => {
  if (req.user) return next();
  passport.authenticate("local", {
    successRedirect: "/app/car",
    failureRedirect: "/app/login",
    failureFlash: true
  })(req, res, next);
};



userCtrl.getLogout = async (req, res) => {
  req.logout();
  req.flash("success_msg", " Sesión Finalizada");
  await res.redirect("app/login");
};

module.exports = userCtrl;
