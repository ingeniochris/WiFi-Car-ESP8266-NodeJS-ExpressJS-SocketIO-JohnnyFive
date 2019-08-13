const { check, validationResult }=require('express-validator');
const User = require ('../models/userModel');
const userCtrl ={};




userCtrl.getRegister = (req, res) => {
    res.render("users/register");
  };

userCtrl.postRegister = [
    check("name").isLength({ min: 4 }),
    check("email").isEmail(),
    check("password").isLength({ min: 5 })
  ], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }  
    const{name, email, password}=req.body;
    let resUser =await user.findOne({name});
    if(resUser){
        req.flash('error_msg', 'El usuario ya se encuentra registrado');
        res.redirect('/users/register');
    }else{
        const newUser = new User({
            name,
            email,
            password
        });
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    await newUser.save();
    req.flash('success_msg', 'Usuario registrado ahora puedes iniciar sesion');
    res.redirect('/users/login');
    }
}   





module.exports=userCtrl;