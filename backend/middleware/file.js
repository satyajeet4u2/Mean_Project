const multerDisk = require('multer');

const MIME_TYPE_MAP = {
  'image/png' :'png',
  'image/jpeg' :  'jpg',
  'image/jpg' : 'jpg'
};

const storage = multerDisk.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let typeError = new Error('Invalid MIME_TYPE');
    if(isValid) {
      typeError = null;
    }
    cb(null, 'backend/images');
  },
  filename: (req, file , cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const fileExt = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' + fileExt);
  }
});

module.exports = multerDisk({storage:storage}).single("image")
