if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const ejsMate = require('ejs-mate')
const mongoose=require("mongoose");

const path=require("path");
const methodeOverRide=require("method-override");
const multer = require('multer');

const dbUrl=process.env.ATLAS_DB;
const ExpressError=require("./util/ExpressError.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js"); 
const userRouter=require("./routes/user.js");
const store=MongoStore.create({
    
     mongoUrl: dbUrl ,
     touchAfter: 24 * 3600,
     crypto:{
        secret:process.env.SECRET,
     }
    })
    store.on("error",()=>{
        console.log("Error in mongo session store",err);
    });
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};

main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

  
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});
app.get("/demouser",async(req,resp)=>{
    const fakeUser=new User({email:"demo@example.com",
        username:"demoUser",
    });
    const registeredUser=await User.register(fakeUser,"demopassword");
    resp.send(registeredUser);
});
app.use(methodeOverRide("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsMate);
app.use(express.static(__dirname+"/public"));

app.use(express.static("public"));
app.get("/",(req,resp)=>{
    resp.redirect("/listings");
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);  
app.use("/",userRouter); 



app.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("terms.ejs");
});

app.use((req,resp,next)=>{
    next(new ExpressError(404,"page not found!"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{message});
});
app.listen(8800,()=>{
    console.log("server is listening to port 8800");
})