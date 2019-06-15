const path = require('path'),
      env = require('dotenv').config({ path: path.join(__dirname, './.env') }),
      utilsHttp = require('./libraries/util.http.js');

module.exports.requireHttps = function (redirect) {
    return function (req, res, next) {
        if (!env.ENV_AZURE) {
            next();
        } else {
            var fs = require('fs');
            var path = require('path');

            if (req.headers['x-arr-ssl']) {
                var clientCert = req.headers['x-arr-clientcert'].trim();

                fs.readFile('authorizedCert.txt', { root: path.join(__dirname, '../') }, function (err, data) {
                    if (err) { return console.error(err); }
                    var authCert = data.trim();

                    if (clientCert === authCert) {
                        next();
                    } else {
                        utilsHttp.unauthorized(req, res);
                    }
                });
            }
            else if (redirect) {
                res.status(301).redirect('https://' + req.hostname + req.url);
            }
            else {
                utilsHttp.notFound(req, res);
            }
        }
    };
};