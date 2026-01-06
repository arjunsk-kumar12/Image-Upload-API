
//load environment variables
require('dotenv').config();

//Import express
const express = require('express');

//import function from db.js(connect to mongoDB database)
const connectToDB = require('./database/db');

//import express routers from appropriate files
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');




//call connectToDB
connectToDB();

//start express application
const app = express();
//get port from .env file
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
//Define route groups(routes inside these will be prefixed with the following lines)
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);


//Start the server and listens for incoming requests
app.listen(PORT, () =>{
    console.log(`Server is listening on port ${PORT}`);
});


