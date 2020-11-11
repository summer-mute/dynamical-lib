// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
require('dotenv').config();
const axios = require('axios').default;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/boxSim",function(req,res){
    db.BoxProfile.create({
      name: req.body.name,
      length: req.body.length,
      width: req.body.width,
      height: req.body.height,
      hexColor: req.body.hexColor,
      yRotation: req.body.yRotation,
      xRotation: req.body.xRotation,
      UserId: req.user.id
    })
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(function(err) {
      res.status(401).json(err);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/boxSim",function(req,res){
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise find all boxProfile where user.id matches 
      db.BoxProfile.findAll({
        where:{
          UserId: req.user.id
        }
      }).then(function(data){
        console.log(data);
        res.json(data);
      });
    }
  });

  app.get("/api/boxSim/:id",function(req,res){
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise find all boxProfile where boxProfile.id matches 
      db.BoxProfile.findOne({
        where:{
          id: req.params.id
        }
      }).then(function(data){
        console.log(data);
        res.json(data);
      });
    }
  });


  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/video/:search", function(req, res){
    axios.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q="+req.params.search+"&key="+process.env.YOUTUBEKEY+"&maxResults=1")
    .then(function(response){
      res.json(response.data);
    }).catch(function (error){
      console.log(error);
    })
  })

  //this function will add a video to the videos table
  app.post("/api/video", function(req, res){
    db.Video.create({
      title: req.body.title,
      videoId: req.body.videoId,
      UserId: req.user.id
    }).then(function(dbVideo){
      res.json(dbVideo)
    });
  });

  app.get("/api/videos", function(req, res){
    db.Video.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(dbVideo){
      res.json(dbVideo);
    })
  })

};
