//require('dotenv').config;
const mongoose = require('mongoose');

const connectToDB = async()=>{
    try{
        //console.log("URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected succesfully");
    }
    catch(e){
        console.error("MongoDB connection failed.");
        process.exit(1);
    }
};

module.exports = connectToDB;