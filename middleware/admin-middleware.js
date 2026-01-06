
//check if user's role is admin
const isAdminUser = (req,res,next) =>{
    if(req.userInfo.role !== 'admin'){
        return res.status(403).json({
            success: false,
            message : "Access denied. Admin Role required."
        });
    }
    next();
}


module.exports = isAdminUser;