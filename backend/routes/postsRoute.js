const express = require('express');
const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

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

router.post("", checkAuth,
  multerDisk({storage:storage}).single("image"),
  (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  })
  // console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post is created",
      post :{
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put('/:id', checkAuth, multerDisk({storage:storage}).single("image"), (req,res,next) => {
  let imagePath= req.body.imagePath;
  if (req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath :imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id:req.params.id, creator: req.userData.userId}, post).then(result => {
    console.log(result);
    if (result.nModified > 0) {
      res.status(200).json({message: "Post Updated"});
    }
    else {
      res.status(401).json({message: "Not Authorized"})
    }
  });
});

router.get('', (req, res, next) => {
  Post.find().then(data => {
    res.status(200).json({
      message: "Post fetched success",
      posts: data
    });
  })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post Not Found with this ID'})
    };
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({message: "Post Deleted"});
    }
    else {
        res.status(401).json({message: "Not Authorized"})
    }
  }).catch(() => {
    console.log("post Not Deleted")
  });
});

module.exports = router
