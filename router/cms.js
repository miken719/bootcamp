const express = require("express");
const { homepageCms, postHomepageCms } = require("../controller/cms");
const router = express.Router();
router.get("/", homepageCms);
router.post("/postcms", postHomepageCms);

module.exports = router;
