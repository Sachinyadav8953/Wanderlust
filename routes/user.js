const express=require("express");
const router=express.Router();
const passport=require("passport");
const userController=require("../controllers/user.js");
const { saveRedirectUrl }=require("../middleware.js");
//signup form
router.get("/signup",userController.renderSignUpForm);
//signup logic
router.post("/signup",userController.signInPost);
//login form
router.get("/login",userController.renderLoginForm);
//login logic
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.loginPost);
//logout logic
router.get("/logout",userController.logout);


module.exports=router;
