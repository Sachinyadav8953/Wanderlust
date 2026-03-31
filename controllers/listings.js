const Listing=require("../models/listing.js");
module.exports.index=async(req,resp)=>{
    const allListings=await Listing.find({});
    resp.render("listings/index.ejs",{allListings});
};
//show route
module.exports.showListing=async(req,resp)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate: { path: "author" }}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return resp.redirect("/listings");
    }
    

    resp.render("listings/show.ejs",{listing});

};
//newlisting form
module.exports.newListingForm=(req,resp)=>{
    resp.render("listings/new.ejs");
};
//new listing
module.exports.newListing=async(req,resp)=>{
   // let {title,description,price,image,country,location}=req.body;
   //let url=req.file.path;
   //let filename=req.file.filename;
  // console.log(url+" "+filename);
   let newListing=new Listing(req.body.listing);

   newListing.image = { url: req.file.path, filename: req.file.filename };
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","Successfully created a new listing!"); 
    
   resp.redirect("/listings");
};

//edit listing

module.exports.editListing=async(req,resp)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return resp.redirect("/listings");
    }
    let origilalImageUrl=listing.image.url;
    origilalImageUrl=origilalImageUrl.replace("/upload/","/upload/w_250");
    resp.render("listings/edit.ejs",{listing,origilalImageUrl});
};
module.exports.updateListing=async(req,resp)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }
    req.flash("success","Successfully Updated listing!");  
    resp.redirect(`/listings/${id}`);
};
//delete listing
module.exports.deleteListing=async(req,resp)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully Deleted listing!");  
    console.log(deletedListing);
    resp.redirect("/listings");
};