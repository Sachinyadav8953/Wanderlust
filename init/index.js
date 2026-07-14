const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_DB || "mongodb://127.0.0.1:27017/wanderlust";
main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  
}
function getCategory(listing) {
    const text = ((listing.title || "") + " " + (listing.description || "")).toLowerCase();
    if (text.includes("beachfront") || text.includes("beach side") || text.includes("oceanfront") || (text.includes("beach") && !text.includes("pool"))) {
        return "Beachfront";
    }
    if (text.includes("lake") || text.includes("river") || text.includes("waterfront")) {
        return "Lakefront";
    }
    if (text.includes("tropical") || text.includes("jungle") || text.includes("rainforest") || text.includes("palm")) {
        return "Tropical";
    }
    if (text.includes("surf") || text.includes("surfing") || text.includes("wave")) {
        return "Surfing";
    }
    if (text.includes("desert") || text.includes("dune") || text.includes("cactus") || text.includes("oasis")) {
        return "Desert";
    }
    if (text.includes("boat") || text.includes("yacht") || text.includes("houseboat") || text.includes("ship")) {
        return "Houseboats";
    }
    if (text.includes("cave") || text.includes("cavern") || text.includes("underground")) {
        return "Caves";
    }
    if (text.includes("dome") || text.includes("yurt") || text.includes("bubble")) {
        return "Domes";
    }
    if (text.includes("golf") || text.includes("course") || text.includes("fairway")) {
        return "Golfing";
    }
    if (text.includes("historical") || text.includes("heritage") || text.includes("monument") || text.includes("ancient") || text.includes("museum")) {
        return "Historical";
    }
    if (text.includes("mountain") || text.includes("cabin") || text.includes("retreat") || text.includes("hill")) {
        return "Mountains";
    }
    if (text.includes("castle") || text.includes("palace") || text.includes("villa") || text.includes("mansion") || text.includes("historic")) {
        return "Castles";
    }
    if (text.includes("pool") || text.includes("sea")) {
        return "Amazing Pools";
    }
    if (text.includes("camp") || text.includes("treehouse") || text.includes("forest") || text.includes("woods") || text.includes("wilderness")) {
        return "Camping";
    }
    if (text.includes("farm") || text.includes("ranch") || text.includes("barn") || text.includes("vineyard") || text.includes("countryside")) {
        return "Farms";
    }
    if (text.includes("arctic") || text.includes("snow") || text.includes("ice") || text.includes("igloo") || text.includes("glacier") || text.includes("winter")) {
        return "Arctic";
    }
    if (text.includes("city") || text.includes("loft") || text.includes("apartment") || text.includes("downtown") || text.includes("studio") || text.includes("urban") || text.includes("penthouse")) {
        return "Iconic Cities";
    }
    if (text.includes("room") || text.includes("bed") || text.includes("hostel") || text.includes("suite") || text.includes("cozy")) {
        return "Rooms";
    }
    return "Trending";
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner: '69c5097ff3bcc6091ab1149b',
        category: getCategory(obj)
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}
initDB();