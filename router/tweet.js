const express = require("express");
const { tweet } = require("../controller/tweet");

const router = express.Router();

router.post("/tweet", tweet);

module.exports = router;
