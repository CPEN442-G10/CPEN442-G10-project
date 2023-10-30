const express = require("express")
const loginController = require("../controllers/loginControllers");
const router = express.Router();

router.get('/', loginController.getLogInPage);

module.exports = router;