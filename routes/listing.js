const express=require("express");
const router=express.Router();
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const path = require('path');

/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});*/

const wrapAsync=require("../util/wrapAsync.js");
const listingController=require("../controllers/listings.js");
const {listingSchema}=require("../schema.js");
const { isLoggedin,isOwner,validateListing }=require("../middleware.js");
//index route
router.route("/") 
.get(wrapAsync(listingController.index))
//NEW LISTING ADD
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingController.newListing)
);

//new listing
router.get("/new",isLoggedin,listingController.newListingForm);
router.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))
//update
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
//delete
//router.post("/",validateListing,wrapAsync(listingController.newListing));
//edit route
 .delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));
router.get("/:id/edit",isLoggedin,isOwner,validateListing,wrapAsync(listingController.editListing));
module.exports=router;