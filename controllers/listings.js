const Listing=require("../models/listing.js");
const Booking=require("../models/booking.js");

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe Secret Key is not configured. Please add STRIPE_SECRET_KEY in your .env file.");
    }
    return require("stripe")(process.env.STRIPE_SECRET_KEY);
};
module.exports.index=async(req,resp)=>{
    const { category, search } = req.query;
    let query = {};
    if (category) {
        query.category = category;
    }
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }
    const allListings=await Listing.find(query);
    resp.render("listings/index.ejs",{allListings, selectedCategory: category || "", searchVal: search || ""});
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

// Booking/Checkout handlers
module.exports.bookListing = async (req, resp) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return resp.redirect("/listings");
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: listing.title,
                    description: listing.description || `Booking for ${listing.title}`,
                    images: listing.image && listing.image.url ? [listing.image.url] : [],
                },
                unit_amount: listing.price * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${protocol}://${host}/listings/${listing._id}/book/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/listings/${listing._id}?payment=cancelled`,
        metadata: {
            listingId: listing._id.toString(),
            userId: req.user._id.toString()
        }
    });

    resp.redirect(303, session.url);
};

module.exports.bookSuccess = async (req, resp) => {
    let { id } = req.params;
    const { session_id } = req.query;

    if (!session_id) {
        req.flash("error", "Payment verification failed: No session ID provided.");
        return resp.redirect(`/listings/${id}`);
    }

    try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            let existingBooking = await Booking.findOne({ stripeSessionId: session.id });
            if (!existingBooking) {
                const newBooking = new Booking({
                    listing: id,
                    user: req.user._id,
                    stripeSessionId: session.id,
                    amountPaid: session.amount_total / 100,
                    paymentStatus: 'paid'
                });
                await newBooking.save();
            }
            req.flash("success", "Successfully booked! Payment of Rs. " + (session.amount_total / 100) + " received.");
        } else {
            req.flash("error", "Payment status is not paid.");
        }
    } catch (err) {
        console.error("Stripe verification error:", err);
        req.flash("error", "Failed to verify Stripe payment.");
    }
    resp.redirect(`/listings/${id}`);
};