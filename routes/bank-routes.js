const express = require("express");
const router = express.Router();
const { routeProtector } = require("./auth-routes");
const { getBankPage, getTransaction, getSuccess, getFailure, postTransaction } = require("../controllers/bank-controllers")
router.get("/bank", routeProtector, getBankPage);
router.get("/bank/transfer", routeProtector, getTransaction);
router.post("/bank/transfer", routeProtector, postTransaction);
router.get("/bank/success", routeProtector, getSuccess);
router.get("/bank/failure", routeProtector, getFailure);

module.exports = router;