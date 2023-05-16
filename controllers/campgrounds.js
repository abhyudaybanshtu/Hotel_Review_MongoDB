const Campground=require('../model/campground')
const {cloudinary}=require('../cloudinary/index')
module.exports.index=async(req,res,next)=>{
    const campgrounds=await Campground.find({}).populate('author').populate('images')
    res.render('campground/index',{campgrounds})
}
module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    const images = Object.values(req.files);
  
    // // Update the campground with the new data
    await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, run: true });
  
    // // Find the updated campground
    const campground = await Campground.findById(id);
  
    // // Upload the images and add them to the `images` array
    await Promise.all(images.map(async (file) => {
      const image = { url: file.path, name: file.filename };
      await campground.images.push(image);
    }));
    // Save the updated campground
    if(req.body.DeleteImage){
        for(let x of req.body.DeleteImage){
            await cloudinary.uploader.destroy(x)
        }
        await campground.updateOne({$pull:{images:{name:{$in:req.body.DeleteImage}}}})
    }
    await campground.save();
    // // Redirect the user
    req.flash('success', 'Successfully updated your campground!');
    res.redirect(`/campground/${id}`);
  }
module.exports.show=async(req,res,next)=>{
    const {id}=req.params;
    const campground = await Campground.findById(id).populate({path: 'reviews',model: 'Review',populate: {path: 'author',model: 'User'}}).populate({path: 'author',model: 'User'}).populate('images');
    res.render('campground/show',{campground})
}
module.exports.editPage=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id).populate('images')
    res.render('campground/edit',{campground})
}
module.exports.delete=async(req,res,next)=>{
    const {id}=req.params;
    // it will trigger findOneAndDelete middleware in model/.js
    await Campground.findByIdAndDelete(id)
    req.flash('deleted','campground successfully deleted!');
    res.redirect('/campground')
}
module.exports.add=async(req,res,next)=>{
    const images=req.files;
    const c1=new Campground(req.body.campground)
    c1.author=req.user._id
    c1.images=images.map(x=>({url:x.path,name:x.filename}))
    await c1.save() 
    req.flash('success','Successfully created a campground!')
    res.redirect('/campground')
}
module.exports.addPage=async(req,res,next)=>{
    res.render('campground/add')
}