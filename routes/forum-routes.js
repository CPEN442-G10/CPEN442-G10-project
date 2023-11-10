const express = require("express");
const router = express.Router();
const {routeProtector} = require("./auth-routes");

router.get("/forum", routeProtector, (req, res) => {
    res.render("forum", {
      pageTitle: "Forum",
      path: "/forum"
    });
});

module.exports = router;