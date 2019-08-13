const {Router}=require('express');
const route = Router();

const{getRegister, postRegister, getLogin, postLogin }=require('../controllers/userCtrl');

route.route('/app/register')
     .get(getRegister)
     .post(postRegister)

route.route('/app/login')
     .get(getLogin)
     .post(postLogin)     




module.exports=route;