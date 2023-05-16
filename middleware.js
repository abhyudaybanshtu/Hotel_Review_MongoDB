const Campground = require("./model/campground");
const Review = require("./model/review");

module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','You must be logged in!')
        return res.redirect('/user/login');
    }
    next()
})

module.exports.isAuth=async(req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"Abbey lawde scam na kar! Onwer nhi h tu")
        return res.redirect(`/campground/${id}`)
    }
    next()
}
module.exports.revAuth=async(req,res,next)=>{
    const {id,revid}=req.params
    const review=await Review.findById(revid)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You cannot delete that review')
        return res.redirect(`/campground/${id}`)
    }
    next()
}