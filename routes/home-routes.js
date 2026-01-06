const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware');
const router = express.Router();

//get request->authMiddleware(validates user)->response
router.get('/welcome', authMiddleWare, (req,res) => {
    //if authMiddleware does not produce any errors then return response
    //extract info from req.userInfo(decrypted)
    const {username, userId, role} = req.userInfo;
    //send json response
    res.json({
        message : "Welcome to the home page",
        user: {
            _id : userId,
            username : username,
            role : role

        }
    });
});

module.exports = router