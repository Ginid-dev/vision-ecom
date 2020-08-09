const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../database/models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password)
    res.status(403).json({ success: false, message: "Login Failed" });
  User.findOne({ email: req.body.email, isActive: true })
    .then((user) => {
      if (!user) {
        res.status(403).json({ success: false, message: "Login Failed" });
      }
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (
          err,
          result
        ) {
          if (result) {
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
              },
              config.get("JWT.key")
            );
            res.status(200).json({
              success: true,
              data: {
                firstName: user.firstName,
                lastName: user.lastName,
                token: "berear " + token,
              },
            });
          }
          if (err)
            res.status(403).json({ success: false, message: "Login Failed" });
        });
      }
    })
    .catch((err) => next(err));
});

router.post("/register", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res
          .status(403)
          .json({ success: false, message: "Email already exists" });
      }
      if (!user) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          if (hash) {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              role: req.body.role,
              isActive: true /*req.body.role == 4*/,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phone: req.body.phone,
            });
            user
              .save()
              .then((result) => {
                res.status(200).json({
                  success: true,
                  message: "Account created",
                });
              })
              .catch((err) => next(err));
          }
          if (err) {
            res
              .status(403)
              .json({ success: false, message: "Something went worng" });
          }
        });
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
