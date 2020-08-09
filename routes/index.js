var express = require("express");
var router = express.Router();

var userRoutes = require("../api/user/user");

router.use("/user", userRoutes);
router.use("/test", (req, res, next) => {
  res.send("req test");
});
module.exports = router;
