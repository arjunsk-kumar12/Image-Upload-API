const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const uploadImageController = async(req,res)=>{
    try{
        //check if image file is missing in req
        if(!req.file){
            return res.status(400).json({
                success: false,
                message : 'file is required. Please upload message.'
            })
        }

        const {url, publicId} = await uploadToCloudinary(req.file.path);

        //store the image url and public id along with the uploaded user id in DB
        const newlyUploadedImage = new Image({
            url: url,
            publicId: publicId,
            uploadedBy : req.userInfo.userId
        });
        await newlyUploadedImage.save();

        //delete files from local storage
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success:true,
            message: "Image uploaded succesfully",
            image: newlyUploadedImage
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Something went wrong! Please try again!"
        })
    }
};

const fetchImageController = async(req,res)=>{
    try{
        //pagination
        const page = parseInt(req.query.page) || 1 ;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;


        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder= req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();

        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(images){
            res.status(200).json({
                success: true,
                currentPage : page,
                totalPages: totalPages,
                totalImages: totalImages,
                message : "Images fetched.",
                data : images
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Something went wrong! Please try again!"
        })
    }
};



const deleteImageController = async(req,res) =>{
    try{
        const getCurrImageId = req.params.id;
        const userId = req.userInfo.userId;

        const image =  await Image.findById(getCurrImageId);

        if(!image){
            return res.status(404).json({
                success : false,
                message : "Image to be deleted is not found."
            });
        }

        //check if image is uploaded by curr user who is trying to delete
        if(image.uploadedBy.toString() != userId){
            return res.status(403).json({
                success : false,
                message : "Action forbidden."
            });
        }

        //delete from cloudinary first
        await cloudinary.uploader.destroy(image.publicId);

        //delete from mongoDB
        await Image.findByIdAndDelete(getCurrImageId);

        res.status(200).json({
            success: true,
            message: "Specified Image has been deleted."
        })



    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Something went wrong! Please try again!"
        })
    }
}
module.exports = {uploadImageController,fetchImageController,deleteImageController};