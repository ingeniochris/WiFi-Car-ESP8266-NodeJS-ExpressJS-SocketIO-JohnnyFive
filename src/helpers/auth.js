module.exports = {
    ensureAuthentication: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'No autoriado');
      res.redirect('/app/login');
    }
  }
  