const User =require('../models/User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const registerUser = async(req,res)=>{
    try{
        //extract user info from req body
        const {username, email, password, role} = req.body;

        //if user already exists in db
        const checkExistingUser = await User.findOne({$or : [{username}, {email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'User already exists either with same username or same email. Please try with different info'

            });
        }

        //hash User password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newlyCreatedUser =  new User({
            username: username,
            email : email,
            password : hashedPassword,
            role : role || 'user'
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                sucess:true,
                message: 'User registered successfully'
            })
        }else{
            res.status(400).json({
                sucess: false,
                message: 'Unable to register User. Please try again.'
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            sucess: false,
            message: "Something went wrong! Please try again"
        });
    }
}

const loginUser= async(req,res)=>{
    try{
        const {username, password} = req.body;
        //find if current user is in database
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                sucess: false,
                message: "Invalid credentials"
            });
        }
        
        //if the entered password is a match or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        //create user token
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '15m'
        });

        res.status(200).json({
            success: true,
            messsage: 'Log in successful',
            accessToken
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            sucess: false,
            message: "Something went wrong! Please try again"
        });
    }
};

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;

        const {oldPassword, newPassword} = req.body;

        //find the current logged in user
        const user = await User.findById(userId);
        //check if user exists
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found."
            });
        }
        
        //check if old password is correctly typed
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Old Password is not correct! Please try again."
            });
        }

        //hash the new password
        const newSalt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,newSalt);

        //update user's password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been changed successfully"
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            sucess: false,
            message: "Something went wrong! Please try again"
        });
    }
}

module.exports = {registerUser, loginUser, changePassword};