const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

router.get('/register', (req, res) => {
  res.render('auth/signup');
});


router.post('/register', async (req, res) => {
  const {username, password, email} = req.body;

  const user = new User({username, email});
  const newUser = await User.register(user, password);

  req.flash("success", "You have been registered successfully");
  res.redirect("/login");
});

router.get('/login', (req, res) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Login Error!! Please try again.."
}), (req, res) => {
  req.flash("success", `${req.user.username.toUpperCase()}, Your login was successfull`);
  res.redirect("/products");
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if(err) { return next(err) }
    req.flash("success", "Goodbye, see you again");
    res.redirect('/login');
  });
})

module.exports = router;