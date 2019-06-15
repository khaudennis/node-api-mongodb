const express = require('express'),
    router = express.Router(),
    docs = require('../collection/documents'),
    utilsHttp = require('../libraries/util.http');

router.get("/:collection", docs.getDocuments);
router.get("/:collection/:id", docs.getDocumentById);

router.get("/Error", function (req, res) { utilsHttp.notFound(req, res); });
router.get("/Error/404", function (req, res) { utilsHttp.notFound(req, res); });
router.get("/Error/415", function (req, res) { utilsHttp.notSupported(req, res); });
router.get("/Error/500", function (req, res) { utilsHttp.serverError(req, res); });
router.get("/Error/503", function (req, res) { utilsHttp.notAvailable(req, res); });

router.get("*", function (req, res) {
    utilsHttp.notFound(req, res);
});

module.exports = router;