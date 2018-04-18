const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../../models/User");

/**
 * @route   GET api/users
 * @desc    Test users route
 * @access  Public
 */
router.get("/", (req, res) => {
  res.json({
    message: "Users works",
    status: 200
  });
});

/**
 * @route   POST api/users/register
 * @desc    Register users
 * @access  Public
 */
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({ email: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm" // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar, // name and property are equals
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log("Error to retrieve user"));
});

/**
 * @route   GET api/users/login
 * @desc    Login users route / Returning token
 * @access  Public
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (user === null) {
      res.status(404).json({ email: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          res.json({ msg: "Success" });
        } else {
          res.status(400).json({ password: "Password incorrect" });
        }
      });
    }
  });
});

module.exports = router;
