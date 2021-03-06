const express = require("express"),
  router = express.Router(),
  db = require("../models"),
  controllers = require("../controllers");

router.post("/signup", controllers.signup);
router.post("/signin", controllers.signin);

module.exports = router;
