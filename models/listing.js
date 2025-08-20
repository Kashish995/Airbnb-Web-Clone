const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: String,
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
