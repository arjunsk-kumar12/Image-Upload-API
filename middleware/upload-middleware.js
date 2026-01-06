const multer = require('multer');
const path = require('path');

//set multer storage
const storage = multer.diskStorage({
    //save uploaded files temporarly in uploads folder
    destination : function(req,file,cb){
        cb(null,"uploads/")
    },
    //keeps filenames 
    filename : function(req,file,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

//file filter(extract from field image)
const checkFileFilter = (req,file,cb) =>{
    //only allows files whose MIME starts with image(image/png)
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new Error('Not an image! Please upload an image'))
    }
}


//multer middleware

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024
    }
})