const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController} = require('../controllers/image-controller');
      

const router = express.Router();



//upload image
router.post('/upload',authMiddleware
    ,adminMiddleware, 
    (req, res, next) => {
    // manually call multer middleware
    uploadMiddleware.single("image")(req, res, (err) => {
      if (err) {
        // Multer error (wrong type, file too large, etc.)
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next(); // call the controller
    }); },
    uploadImageController);


//get all images
router.get('/get', authMiddleware,fetchImageController );

//delete image
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;