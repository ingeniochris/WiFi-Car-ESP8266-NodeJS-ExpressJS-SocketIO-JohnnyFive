const controlCtrl={};


controlCtrl.getControl= async (req,res)=>{
   await res.render('control/control');
}





module.exports=controlCtrl;