const path = require('path'),
    env = require('dotenv').config({ path: path.join(__dirname, './.env') }),
    MongoConnection = require('./db/mongodb'),
    express = require('express'),
    routes = require('./routes/default'),
    app = express(),
    port = process.env.PORT,
    utils = require('./libraries/util.js');

process.setMaxListeners(0);
process.env.NODE_ENV = env.ENV_SYSTEM;
app.set('query parser', 'simple');
app.use('/', routes);

// ### Error Catching
app.use(function (err, req, res, next) {
    if (env.ENV_SYSTEM !== "development") {
        if (err) {
            if (env.ENV_SHOW_CONSOLE) console.error("[ERROR]  " + utils.getDateTime().toString() + " " + err);
            res.status(err.statusCode || 500).json(err);
        }
    } else {
        next(err);
    }
});

// ### Connect to DB & Start App
MongoConnection.connect(function (err) {
    if (err) {
        if (env.ENV_SHOW_CONSOLE) console.error("[ERROR]  " + utils.getDateTime().toString() + " " + err);
        process.exit(1);
    } else {
        app.listen(port, (err) => { if (env.ENV_SHOW_CONSOLE) console.log("[START]  " + utils.getDateTime().toString() + " Node is running on port " + port); });
    }
});