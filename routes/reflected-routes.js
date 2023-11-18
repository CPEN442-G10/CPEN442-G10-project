const express = require("express");
const router = express.Router();
const { routeProtector } = require("./auth-routes");
const {
  getVotePage,
  checkAnswer,
} = require("../controllers/reflected-controller");
router.get("/vote", routeProtector, getVotePage);
router.post("/vote", routeProtector, checkAnswer);

module.exports = router;
