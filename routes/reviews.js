const express=require("express");
const router=express.Router({mergeParams:true});

const reviewController=require("../controllers/review.js");
const Listing=require("../models/listing.js");
const { validateReview ,isLoggedin,isReviewAuthor}=require("../middleware.js");
const wrapAsync=require("../util/wrapAsync.js");



//post review
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.postReview));
//delete review
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;