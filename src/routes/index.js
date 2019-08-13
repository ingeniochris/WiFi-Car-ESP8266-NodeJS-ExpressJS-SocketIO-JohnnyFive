const {Router}=require('express');
const route = Router();

const {getIndex} = require ('../controllers/indexCtrl');


route.route('/')
     .get(getIndex)






module.exports=route;