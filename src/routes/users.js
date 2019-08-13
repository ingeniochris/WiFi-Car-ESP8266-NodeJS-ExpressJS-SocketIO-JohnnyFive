const {Router}=require('express');
const route = Router();

const{getRegister, postRegister }=require('../controllers/userCtrl');

route.route('/app/register')
     .get(getRegister)
     .post(postRegister)




module.exports=route;