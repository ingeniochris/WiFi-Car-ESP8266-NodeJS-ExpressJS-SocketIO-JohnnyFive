const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const user = require("../models/userModel");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const userId = await user.findById(id);
    done(null, userId);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email"
      },
      async (email, password, done) => {
        const userNew = await user.findOne({ email });
        if (!userNew)
          return done(null, false, { message: "Usuario no encontrado" });

        bcrypt.compare(password, userNew.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, userNew);
          } else {
            return done(null, false, { message: "Password incorrecto" });
          }
        });
      }
    )
  );
};
