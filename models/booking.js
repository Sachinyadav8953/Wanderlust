const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true,
        unique: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
