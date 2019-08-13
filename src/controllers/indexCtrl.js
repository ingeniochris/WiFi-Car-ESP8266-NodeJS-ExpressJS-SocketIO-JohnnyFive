const indexControl={};

indexControl.getIndex = (req,res)=>{
    res.render('index', {title:'Car WiFi Aplication'});
};







module.exports=indexControl;