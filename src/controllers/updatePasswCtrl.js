const { promisify } = require("util");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const randomBytesAsync = promisify(crypto.randomBytes);
const validator = require('validator');
const bcrypt = require("bcryptjs");

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


updatePassCtrl.getReset = async (req,res,next)=> {
  const errors = [];
  if (!validator.isHexadecimal(req.params.token)) errors.push({ text: 'Token invalido, intente nuevamente.' });
  if (errors.length > 0) {
    res.render("users/forgot", {
      errors
    });
  }

  User
  .findOne({ resetPasswordToken: req.params.token })
  .where('resetPasswordExpires').gt(Date.now())
  .exec((err, user) => {
    if (err) { return next(err); }                  
   if(!user){
     req.flash("error_msg",
     "Token invalido o ah expirado");
     return res.redirect('/app/forgot');
   }

   res.render('users/reset', {user});
  });

};

updatePassCtrl.postReset = (req,res)=>{
  const {password, confirm} = req.body;
 const errors =[];
 if(!validator.isLength(password,{min:8})) errors.push({text:'El Password debe se mayor a 8 caracteres'});
 if(password !== confirm) errors.push({text:'Password no coinciden'});
 if(!validator.isHexadecimal(req.params.token)) errors.push({text:' Token invalido, intente de nuevo'})

 if(errors.length>0){
  req.flash('error_msg', 'Not Authorized');
  return res.redirect('back');
 // return res.render('users/forgot',{errors});
 }

 const resetPassword =  () =>
 User
   .findOne({ resetPasswordToken: req.params.token })
   .where('resetPasswordExpires').gt(Date.now())
   .then(async (user) => {
     if (!user) {
       req.flash('errors', { text: 'Token invalido o ah caducado.' });
       return res.redirect('back');
     }

     let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(password, salt);
     user.password = hash;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
    const us = await user.save();
     return us;
   });

   const sendResetPasswordEmail = async (user) => {
     try{
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: "	dev.chrisweb@gmail.com",
      subject: "Reset you WiFi Kart password",
      text: `Hola \n\n Le confirmamos que la contraseña de su cuenta ${user.email} acaba de cambiar satisfactoriamente.`
    };
    const sm = await transporter.sendMail(mailOptions);
    req.flash(
      "success_msg",
      'Su password se a actualizado correctamente'
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
        'Su password se a modificado correctamente'
      );

      return sm2;
    }
    console.log(
      "ERROR: No se pudo enviar el correo electrónico de contraseña olvidada después de la reducción de seguridad.\n",
      err
    );
    req.flash(
      "error_msg",
      "Error al intentar cambiar su password. Por favor intente nuevamente."
    );

    return err;
  };
    
  };
  resetPassword()
  .then(sendResetPasswordEmail)
  .then(() => { if (!res.finished) res.redirect('/'); })
  .catch((err) => next(err));
};
















module.exports= updatePassCtrl;