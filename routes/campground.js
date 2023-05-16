const express=require('express')
const router = express.Router();
const campgrounds=require('../controllers/campgrounds')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const {CampgroundSchema}=require('../validate')
const {isLoggedIn,isAuth}=require('../middleware')
const {storage}=require('../cloudinary/index')
const multer  = require('multer')
const upload = multer({ storage:storage })
const validateSchema=(req,res,next)=>{
    const {error}=CampgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(ol=>ol.message).join(',')
        throw new ExpressError(msg,400)}
    else{
        next()
    }
}
router.get('/add',isLoggedIn,campgrounds.addPage)
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('images'),validateSchema,catchAsync(campgrounds.add));
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body,req.files)
    //     res.send("Uploaded Finally")
    // });
router.route('/:id')   
    .delete(isLoggedIn,isAuth,catchAsync(campgrounds.delete))    
    .get(catchAsync(campgrounds.show))  
    .put(isLoggedIn,upload.array('images'),isAuth,validateSchema,catchAsync(campgrounds.update));

router.get('/:id/edit',isLoggedIn,catchAsync(campgrounds.editPage))  
module.exports=router;