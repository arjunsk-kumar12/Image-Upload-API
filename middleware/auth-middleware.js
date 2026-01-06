
const jwt = require('jsonwebtoken');

const authMiddleWare = (req,res, next) =>{
    const authHeader = req.headers['authorization'];
    //console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    //console.log("token:",token);
    if(!token){
        return res.status(401).json({
            success: false,
            message : "Access denied. No token provided; please login again."
        })
    }

    try{
        const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodeTokenInfo);
      
        req.userInfo = decodeTokenInfo;
    }catch(e){
        return res.status(500).json({
            success: false,
            message : "Access denied. No token provided; please login again."
        })
    }
    next();
}

module.exports = authMiddleWare;