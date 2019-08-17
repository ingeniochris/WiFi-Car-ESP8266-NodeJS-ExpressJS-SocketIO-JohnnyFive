const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/userModel");

const userCtrl = {};

userCtrl.getRegister = (req, res, next) => {
  res.render("users/register");
};

userCtrl.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];
  if (name.length <= 0) {
    errors.push({ text: "Ingresa un Nombre porfavor" });
  }
  if (email.length <= 0) {
    errors.push({ text: "Ingresa un Email porfavor" });
  }
  if (password.length <= 0) {
    errors.push({ text: "Ingresa un Password porfavor" });
  }
  if (name.length < 4) {
    errors.push({ text: "Ingresa un nombre con almenos 4 caracteres." });
  }
  if (email.length < 7) {
    errors.push({ text: "Ingresa un email correcto" });
  }

  if (password.length < 4) {
    errors.push({
      text: "Porfavor ingresa un password de almenos 4 caracteres."
    });
  }

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
      req.flash("error_msg", "El usuario ya se encuentra registrado");
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
        "Usuario registrado ahora puedes iniciar sesion"
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
  req.flash("success_msg", " sesion finalizada");
  await res.redirect("app/login");
};

module.exports = userCtrl;