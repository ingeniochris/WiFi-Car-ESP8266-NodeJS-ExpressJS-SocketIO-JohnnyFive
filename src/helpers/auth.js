const Auth = {};

Auth.ensureAuthentication = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Porfavor Inicie Sesión");
  res.redirect("/app/login");
};

Auth.forwardAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/app/car");
};

module.exports = Auth;
