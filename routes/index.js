require('dotenv').load();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var db = require('monk')(process.env.MONGOLAB_URI);
var user = db.get('users');
var userMore = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('new');
});

router.post('/login', function(req, res, next) {
    console.log(userMore);
  userMore.findOne({email: req.body.email}, function (err, docs) {
    console.log('hey')
    if (docs && bcrypt.compareSync(req.body.passwordDigest, docs.passwordDigest)) {
      req.session.id = docs._id;
      console.log(req.session);
      res.redirect('/');
    }

    else {
      res.render('login', {loginError: 'Invalid username or password'});
    }

  })

});

router.post('/register', function(req, res, next) {
  if (req.body.email == false) {
    console.log("Email cannot be blank.");
    res.render('new', {error: "Email cannot be blank"}); // render sends a GET request
  }
  else {
    console.log("Email submitted.");
    user.find({email: req.body.email}, function (err, docs) {
      // no if err?
      if (docs.length === 0) { // if user isn't registered - double or triple equals?
      console.log("Username available.");
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          user = user.insert({ email: req.body.email, passwordDigest: hash }); // upper and lower case user?
          req.session.id = docs._id; // makes a session cookie
          res.redirect('/');
        });
      });
    } else {
      console.log("Username already exists.")
      res.render('new', {error: "Email already exists", email: req.body.email});
    }
  });
}
});

router.get('/logout', function (req, res) {
  req.session = null;
  res.redirect('/');
})

module.exports = router;
