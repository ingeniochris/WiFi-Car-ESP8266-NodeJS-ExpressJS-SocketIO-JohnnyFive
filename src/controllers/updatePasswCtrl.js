const { promisify } = require("util");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const randomBytesAsync = promisify(crypto.randomBytes);
const validator = require('validator');

const User = require("../models/userModel");
const updatePassCtrl = {};

//getForgot
updatePassCtrl.getForgot = (req, res, next) => {
  res.render("users/forgot");
};

//postForgot
updatePassCtrl.postForgot = (req, res, next) => {
  let { email } = req.body;
  const errors = [];
  if (!validator.isEmail(email)) errors.push({ text: 'Porfavor ingresa un email valido' });
  if (email.length <= 0) errors.push({ text: "Ingresa un Email. " });
  
  if (errors.length > 0) {
    res.render("users/forgot", {
      errors,
      email: req.body.email
    });
  }

  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  const createRandomToken = randomBytesAsync(16).then(buf =>
    buf.toString("hex")
  );

  const setRandomToken = async (token) => {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash(
        "error_msg",
        "La cuenta con esa dirección de correo electrónico no existe."
      );
      //  res.redirect("/app/forgot");
    } else {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 600000; // 1 hour
      user = user.save();
    }
    return user;
  };

  const sendForgotPasswordEmail = async (user) => {
    try {
      if (!user) {
        return;
      }
      const token = user.resetPasswordToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: "	dev.chrisweb@gmail.com",
        subject: "Reset you WiFi Kart password",
        text: `
            Está recibiendo este correo electrónico porque usted (u otra persona) ha solicitado restablecer la contraseña de su cuenta.\n
            Haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso :\n\n
              http://${req.headers.host}/app/reset/${token}\n\n
            Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios..\n\n
            WiFi Kart by Christian Castillo\n
            https://wifi-kart.herokuapp.com/ \n\n
            http://chrisweb.me \n\n
            `
      };
      const sm = await transporter.sendMail(mailOptions);
      req.flash(
        "success_msg",
        `Se ha enviado un correo electrónico a ${user.email} con más instrucciones.`
      );

      return sm;
    } catch (err) {
      if (err.message === "self signed certificate in certificate chain") {
        console.log(
          "ADVERTENCIA: Certificado autofirmado en la cadena de certificados. Reintentando con el certificado autofirmado. Use un certificado válido si está en producción."
        );
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        let sm2 = await transporter.sendMail(mailOptions);
        req.flash(
          "success_msg",
          `Se ha enviado un correo electrónico a ${user.email} con más instrucciones.`
        );

        return sm2;
      }
      console.log(
        "ERROR: No se pudo enviar el correo electrónico de contraseña olvidada después de la reducción de seguridad.\n",
        err
      );
      req.flash(
        "error_msg",
        "Error al enviar el mensaje de restablecimiento de contraseña. Por favor intente nuevamente en breve."
      );

      return err;
    }
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect("/app/forgot"))
    .catch(next);
};


updatePassCtrl.getReset = async (req,res)=> {
  const {token} = req.params.token
  const errors = [];
  if (!validator.isHexadecimal(req.params.token)) errors.push({ text: 'Token invalido, intente nuevamente.' });
  if (errors.length > 0) {
    res.render("users/forgot", {
      errors
    });
  }

  const user = await User.findOne({ resetPasswordToken : token });
                      
   if(!user){
     req.flash("error_msg",
     "Token invalido o ah expirado");
     return res.redirect('/app/forgot');
   }

   res.render('users/reset');


};

















module.exports= updatePassCtrl;