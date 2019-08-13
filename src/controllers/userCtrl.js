const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");

const User = require("../models/userModel");

const userCtrl = {};

userCtrl.getRegister = (req, res) => {
  res.render("users/register");
};


userCtrl.postRegister =  async (req, res) => {
   
    const { name, email, password } = req.body;
    console.log(req.body)
    let resEmail = await User.findOne({ email });
    if (resEmail) {
      req.flash("error_msg", "El usuario ya se encuentra registrado");
      res.redirect("/users/register");
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      let salt = await bcrypt.genSaltSync(10);
      let hash = await bcrypt.hash(newUser.password , salt);
      newUser.password = hash;
      await newUser.save();
      req.flash(
        "success_msg",
        "Usuario registrado ahora puedes iniciar sesion"
      );
      res.redirect("/users/login");
    }
  };

userCtrl.getLogin = (req,res)=>{
  res.render('users/login');
}

userCtrl.postLogin = (req,res,next)=>{
  passport.authenticate('local', {
    successRedirect: '/app/control',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}

module.exports = userCtrl;
