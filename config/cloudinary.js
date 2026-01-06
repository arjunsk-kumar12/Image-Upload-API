//Client -> Express Route(middlewares) -> Controller -> Cloudinary(url and publicid) -> MongoDB


//Import cloudinary
const cloudinary = require('cloudinary').v2;


//Authenticate using .env variables
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;