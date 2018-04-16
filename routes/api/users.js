const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Users",
    status: 200
  });
});

module.exports = router;
