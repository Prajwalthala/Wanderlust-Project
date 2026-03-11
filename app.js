if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose=require("mongoose");

const path =require("path");
const methodOverride = require("method-override");
const url="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate =require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError");
const session = require("express-session");
const flash =require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local");
const User =require("./models/user.js");
app.engine("ejs",ejsMate);
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
 const userRouter=require("./routes/user.js");
app.locals.mapToken = process.env.MAP_TOKEN;

const sessionOptions ={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser =req.user;
next();
});
app.get("/",(req,res)=>{
    res.send("hi i am the route");
});


async function main(){
    await mongoose.connect(url);
};
main().then((res)=>{
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log("not connected to mongodb");
});
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

app.get("/demoUser",async(req,res)=>{
let fakeUser = new User({
    email:"student@gmail.com",
    username:"delta-student"
});
const registeredUser=await User.register(fakeUser ,"helloworld");
res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// app.get("/listing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
//index route

// review route 
//post route
// create new route 


////}));
//// delete review  route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

//show route
// app.get("/listings/:id",async (req,res)=>{
//    let {id}= req.params;    
//     const listing=await Listing.findById(id).populate("reviews");
//  res.render("listings/show.ejs",{listing});

// });
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{message});
//    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log(`listening on the port 8080`);
});
