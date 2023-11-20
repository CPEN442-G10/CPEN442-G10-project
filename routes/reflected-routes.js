const uuid = require("uuid");

const express = require("express");
const router = express.Router();
const { routeProtector } = require("./auth-routes");
const {
  getVotePage,
  checkAnswer,
} = require("../controllers/reflected-controller");

router.get("/vote", routeProtector, getVotePage);
router.post("/answer", routeProtector, checkAnswer);

module.exports = router;
