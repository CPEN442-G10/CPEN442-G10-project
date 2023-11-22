const express = require('express');
const router = express.Router();
const {routeProtector} = require("./auth-routes");
const sqlInjectionController = require('../controllers/sql-injection-controller');

router.get('/sql-injection/login', sqlInjectionController.getSqlInjectionLoginPage);
router.post('/sql-injection/login', sqlInjectionController.postSqlInjectionLogin);
router.get('/sql-injection/knowledge', routeProtector, sqlInjectionController.getSqlInjectionKnowledgePage);
router.get('/sql-injection', routeProtector, sqlInjectionController.getSqlInjectionIndexPage);
router.post('/sql-injection', routeProtector, sqlInjectionController.postSqlInjectionIndexPage);

module.exports = router;
