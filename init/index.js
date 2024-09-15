const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    return await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}
main()
    .then((res)=>{
        console.log("Connected");
    })
    .catch((err)=>{
        console.log("error connecting DB");
    });

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner:"66e42eb57eeaa20c4ebc0266"}));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();