const User=require("../models/user.js");
//signin form
module.exports.renderSignUpForm=(req,resp)=>{
    resp.render("users/signup.ejs");
}
//signin logic
module.exports.signInPost=async(req,resp)=>{
    try{
        const {email,username,password}=req.body;   
        const user=new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next (err);
            }
            req.flash("success","Welcome to Wanderlust!");
            resp.redirect("/listings");
            //next();
        })
        
    }catch(e){
        req.flash("error",e.message);
        resp.redirect("/signup");
    }
};
//login form
module.exports.renderLoginForm=(req,resp)=>{
    resp.render("users/login.ejs");
}
//login logic
module.exports.loginPost=async(req,resp)=>{
    req.flash("success","Welcome back!");
    //const redirectUrl=req.session.returnTo || "/listings";
    //delete req.session.returnTo;
    resp.redirect(resp.locals.redirectUrl || "/listings");
};
//logout logic
module.exports.logout=(req,resp)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you out!");
        resp.redirect("/listings");
    });
};
