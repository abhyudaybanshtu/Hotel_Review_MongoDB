const express=require('express')
const router = express.Router({mergeParams:true});
const {isLoggedIn,revAuth}=require('../middleware')
const reviews=require('../controllers/reviews')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const {reviewSchema}=require('../validate')
const validreview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(ol=>ol.message).join(',')
        throw new ExpressError(msg,400)}
    else{
        next()
    }
}
router.post('/',isLoggedIn,validreview,catchAsync(reviews.add))
router.delete('/:revid',isLoggedIn,revAuth,catchAsync(reviews.delete))
module.exports=router
