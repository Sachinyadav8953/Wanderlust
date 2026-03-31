 const  Listing  = require("./models/listing");
 const ExpressError=require("./util/ExpressError.js");
 const {listingSchema, reviewSchema}=require("./schema.js");
 const Review=require("./models/review.js");
 module.exports = {
    isLoggedin: (req, resp, next) => {
        if (!req.isAuthenticated()) {
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in to access this page!");
            return resp.redirect("/login");
        }
        next();
    },
    saveRedirectUrl: (req, resp, next) => {
        if (req.session.redirectUrl) {
            resp.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    },
    isOwner:async (req,resp,next)=>{
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing.owner.equals(resp.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return resp.redirect(`/listings/${id}`);}
        next();
        
    },
     validateListing:(req,resp,next)=>{
        let {error}=listingSchema.validate(req.body);
       
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
       }
       else{
        next();
       }
    },
    validateReview:(req,resp,next)=>{
        let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(404,errMsg);
        }
        else{
            next();
        }
    },
    isReviewAuthor:async (req,resp,next)=>{
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author.equals(resp.locals.currentUser._id)){
            req.flash("error","You are not the author of this review!");
            return resp.redirect(`/listings/${id}`);
        }
        next();
        
    },
    
};