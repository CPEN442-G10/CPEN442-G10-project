const express = require("express");
const router = express.Router();
const {routeProtector} = require("./auth-routes");
const {getForumPage, getForumTopic, getAttackPage, addUnsafePost, addSafePost} = require("../controllers/forum-controller");

router.get("/forum", routeProtector, getForumPage);
router.get("/forum/:topic", routeProtector, getForumTopic)
router.get("/forum/trap/:attacker", routeProtector, getAttackPage);
router.post("/forum/add-unsafe-post", routeProtector, addUnsafePost);
router.post("/forum/add-safe-post", routeProtector, addSafePost);

module.exports = router;