const Review=require('../model/review')
const Campground=require('../model/campground')
module.exports.add=async(req,res)=>{
    const {id}=req.params;
    const review=new Review(req.body)
    review.author=req.user._id;
    const campground=await Campground.findById(id)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','review successfully created!`1')
    res.redirect(`/campground/${id}`)
}
module.exports.delete=async(req,res)=>{
    const {id,revid}=req.params
    await Review.findByIdAndDelete(revid)
    req.flash('deleted',"Review successfully deleted")
    res.redirect(`/campground/${id}`)
}