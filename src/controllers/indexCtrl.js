const indexControl={};

indexControl.getIndex = async (req,res)=>{
     await res.render('index');
};

indexControl.getAbout= async (req,res)=>{
  await  res.render('partials/about');
}







module.exports=indexControl;