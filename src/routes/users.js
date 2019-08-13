const {Router}=require('express');
const route = Router();


const{getRegister, postRegister, getLogin, postLogin, getLogout }=require('../controllers/userCtrl');

route.route('/app/register')
     .get(getRegister)
     .post(postRegister)

route.route('/app/login')
     .get(getLogin)
     .post(postLogin)   
     
route.route('/logout')   
     .get(getLogout)




module.exports=route;