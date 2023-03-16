const express = require("express");
const {
  homepageCms,
  postHomepageCms,
  updateMetaInformation,
  deleteMeta,
} = require("../controller/cms");
const router = express.Router();
router.get("/", homepageCms);
router.post("/postcms", postHomepageCms);
router.put("/:id", updateMetaInformation);
router.delete("/:id", deleteMeta);

module.exports = router;
