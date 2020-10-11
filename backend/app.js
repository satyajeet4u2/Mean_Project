const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
const postRoutes = require('./routes/postsRoute');
const userRoutes = require('./routes/userRoute');


//mongodb+srv://satyajeet:9fArGVIaG4IbE5RA@cluster0-tvsqu.mongodb.net/test?retryWrites=true&w=majority
// mongoose.connect("mongodb://mongodb+srv://satyajeet:9fArGVIaG4IbE5RA@cluster0-tvsqu.mongodb.net/test?retryWrites=true&w=majority",
mongoose.connect("mongodb://127.0.0.1:27017/Mean-Project",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to DB")
  })
  .catch(() => {
    console.log("connection Fail to DB")
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
app.use('/images', express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/api/posts',postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
