const express = require("express");
const router = express.Router();
const {routeProtector} = require("./auth-routes");
const {getHomePage} = require("../controllers/home-controllers");

router.get("/home", routeProtector, getHomePage);

module.exports = router;
