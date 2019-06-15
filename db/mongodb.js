const path = require('path'),
    env = require('dotenv').config({ path: path.join(__dirname, './.env') }),
    MongoClient = require('mongodb').MongoClient,
    utils = require('../libraries/util.js');

let state = {
    db: null
};

exports.connect = function (done) {
    if (state.db) return done();
    if (process.env.ENV_SHOW_CONSOLE) console.log('[DB]  ' + utils.getDateTime().toString() + ' Attempting Connection to MongoDB');

    let url = '';

    if (process.env.ENV_SYSTEM === 'development') {
        url = 'mongodb://' + process.env.MDB_HOST + '/' + process.env.MDB_DB;

        MongoClient.connect(url, {
            useNewUrlParser: true,
            autoReconnect: true,
            poolSize: 50
        }, function (err, client) {
            if (err) return done(err);
            if (process.env.ENV_SHOW_CONSOLE) console.log('[DB]  ' + utils.getDateTime().toString() + ' Connected to MongoDB');
            state.db = client.db(process.env.MDB_DB);
            done();
        });
    } else {
        url = 'mongodb://' + process.env.MDB_USERNAME + ':' + process.env.MDB_PASSWORD + '@' + process.env.MDB_HOST + '/' + process.env.MDB_DB;

        if (process.env.ENV_SHOW_CONSOLE) console.log('[DB]  ' + utils.getDateTime().toString() + ' Authenticating with MongoDB');

        MongoClient.connect(url, {
            useNewUrlParser: true,
            autoReconnect: true,
            poolSize: 50,
            ssl: true,
            replicaSet: process.env.MDB_RS
        }, function (err, client) {
            if (err) return done(err);
            if (process.env.ENV_SHOW_CONSOLE) console.log('[DB]  ' + utils.getDateTime().toString() + ' Connected to MongoDB');
            state.db = client.db(process.env.MDB_DB);
            done();
        });
    }
};

exports.get = function () {
    return state.db;
};

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};