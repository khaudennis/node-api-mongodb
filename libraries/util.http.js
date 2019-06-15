const errorHandler = require('./errorHandling.js');
let intMsg = null;
let reqUrl = null;

module.exports = {
    unauthorized: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(401).json({ "responseCode": 401, "responseMessage": "Unauthorized" });
    },

    notFound: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(404).json({ "responseCode": 404, "responseMessage": "Resource Not Found" });
    },

    notSupported: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(415).send({ "responseCode": 415, "responseMessage": "Unsupported Media Type" });
    },

    serverError: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ "responseCode": 500, "responseMessage": "Internal Server Error" });
    },

    notImplemented: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(501).json({ "responseCode": 501, "responseMessage": "Not Implemented" });
    },

    notAvailable: function (req, res) {
        reqUrl = req.url.toLowerCase();

        res.setHeader("Content-Type", "application/json");
        res.status(503).json({ "responseCode": 503, "responseMessage": "Service Unavailable" });
    }
};