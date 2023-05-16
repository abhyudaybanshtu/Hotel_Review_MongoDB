const Campground=require('../model/campground')
const mongoose=require('mongoose')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> {
        console.log('CONNECTION ROCKS!! SUPAAA')
    })
    .catch(err =>{
        console.log("OH NO ERROR!!!")
        console.log(err)
    });
const sample= array=>array[Math.floor(Math.random()*array.length)]
const seedDB=async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const randno=Math.floor(Math.random()*1000)
        const camp =new Campground({
            author:'643525875785358602f57905',
            location:`${cities[randno].city},${cities[randno].state}`,
            title:`${sample(descriptors)}  ${sample(places)}`,
            image:'https://source.unsplash.com/user/wsanter',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis culpa quo autem, libero, natus sed ipsum mollitia animi, iste voluptatibus illo quaerat? Mollitia iusto vero, voluptatum odit nemo ipsum? Iusto quisquam aperiam ipsum in officia soluta tempore sapiente quia id',
            price:Math.random()*100+200
        })
        await camp.save()
    }
}
seedDB();