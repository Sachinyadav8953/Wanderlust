const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.postReview=async(req,resp)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Successfully added review!");
    resp.redirect(`/listings/${id}`);
};
module.exports.deleteReview=async(req,resp)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Successfully deleted review!");
    resp.redirect(`/listings/${id}`);
};