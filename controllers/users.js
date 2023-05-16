const User=require('../model/user')

module.exports.logout=async(req,res)=>{
    req.logout(function(err){
        if(err){
        req.flash('error',err);
        return res.redirect('/user/login');
    }
        req.flash('success',"GoodBye Mate!");
        res.redirect('/campground')
    })
}
module.exports.add=async(req,res)=>{
    const {username,password,email}=await req.body
    const user=new User({username:username,email:email})
    const ru=await User.register(user,password)
    req.login(ru,err=>{
        if(err){ return next(err)}
        req.flash('success','Successfully signed In!')
        res.redirect('/campground')
    })
}
module.exports.addPage=async(req,res)=>{
    res.render('user/register')
}
module.exports.login=async(req,res)=>{
    if(req.session.returnTo !='/campground/:id/review'){
    const rl=req.session.returnTo || '/campground'
    return res.redirect(rl) }
    res.redirect('/campground')
}
module.exports.loginPage=async(req,res)=>{
    res.render('user/login')
}