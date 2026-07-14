const Booking = require("../models/booking.js");

module.exports.index = async (req, resp) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    resp.render("bookings/index.ejs", { bookings });
};
