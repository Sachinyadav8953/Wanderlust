const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const bookingController = require("../controllers/bookings.js");
const { isLoggedin } = require("../middleware.js");

// View booking history
router.get("/", isLoggedin, wrapAsync(bookingController.index));

module.exports = router;
