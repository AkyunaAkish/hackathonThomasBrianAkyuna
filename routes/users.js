var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

require('dotenv').load();
var db = require('monk')(process.env.MONGOLAB_URI); // database name
var user = db.get('users'); // collection name

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('new');
});

router.post('/register', function(req, res, next) {
  if (req.body.email == false) {
    console.log("Email cannot be blank.");
    res.render('new', {error: "Email cannot be blank"}); // render sends a GET request
  }
  else {
    user.find({email: req.body.email}, function (err, doc) {
      console.log("Email submitted.");
      // no if err?
      if (docs.length === 0) { // if user isn't registered - double or triple equals?
        console.log("Username is available.");
          bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            user = user.insert({ email: req.body.email, passwordDigest: hash }); // upper and lower case user?
            req.session.currentUserEmail = user.query.email; // makes a session cookie
            res.redirect('/');
          });
        });
      } else {
        console.log("Username taken.");
        res.render('new', {error: "Email already exists", email: req.body.email});
      }
    });
  }
});


module.exports = router;
