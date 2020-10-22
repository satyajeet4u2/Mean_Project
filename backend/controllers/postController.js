const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');



exports.createNewPost = (req, res, next) => {
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
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating Post failed"
      })
    });
}

exports.updatePost = (req,res,next) => {
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
    if (result.n > 0) {
      res.status(200).json({message: "Post Updated"});
    }
    else {
      res.status(401).json({message: "Not Authorized"})
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Updating Post failed"
      })
    });
}

exports.getAllPost = (req, res, next) => {
  Post.find().then(data => {
    res.status(200).json({
      message: "Post fetched success",
      posts: data
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching All Post failed"
      })
    });
}

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post Not Found with this ID'})
    };
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Post Failed"
      })
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({message: "Post Deleted"});
    }
    else {
      res.status(401).json({message: "Not Authorized Backend"})
    }
  }).catch(() => {
    console.log("post Not Deleted")
  });
}
