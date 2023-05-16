const mongoose=require('mongoose')
const Review=require('./review')
const {cloudinary}=require('../cloudinary')
const CampgroundSchema=new mongoose.Schema({
    title:String,
    images:[
     {url:String,
      name:String}
    ],
    price:Number,
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete',async(x)=>{
    if(x){
        for(let o of x.images)
        await cloudinary.uploader.destroy(o.name)
        await Review.deleteMany({
            _id:{$in:x.reviews}
        })
        
    }

})
const Campground=mongoose.model('Campground',CampgroundSchema)

module.exports=Campground