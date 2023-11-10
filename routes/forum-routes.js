const express = require("express");
const router = express.Router();
const {routeProtector} = require("./auth-routes");
const {getForumPage} = require("../controllers/forum-controller")
router.get("/forum", routeProtector, getForumPage);

module.exports = router;