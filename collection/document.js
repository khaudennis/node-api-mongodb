const path = require('path'),
    env = require('dotenv').config({ path: path.join(__dirname, './.env') }),
    utils = require('../libraries/util'),
    utilsHttp = require('../libraries/util.http'),
    ex = require('../libraries/errorHandling'),
    js2xml = require('js2xmlparser'),
    db = require('./db/mongodb');

module.exports.getDocuments = function (request, response, next) {    
    let collectionName = request.params.collection;

    if (request.query.$top > env.RESPONSE_LIMIT || !request.query.$top) { request.query.$top = env.RESPONSE_LIMIT; }
    if (!request.query.$inlinecount) { request.query.$inlinecount = true; }

    //TODO:  Requires implementation w/o Breeze
    // query.execute(db.get(), collectionName, function (error, results, next) {
    //     if (env.ENV_SHOW_CONSOLE) console.log("[REQUEST]  " + utils.getDateTime().toString() + " Collection: " + collectionName + " w/ Request=" + request.url);
    //     !error ? results !== null ? responseMetadata(request, response, results, next) : utilsHttp.notFound(request, response) : ex.handleError(request, response, error);
    // });
};

module.exports.getDocumentById = function (request, response) {
    let collectionName = request.params.collection;
    let id = request.params.id;

    if (!request.query.$inlinecount) { request.query.$inlinecount = true; }

    //TODO:  Requires implementation w/o Breeze
    // query.execute(db.get(), collectionName, function (error, results, next) {
    //     if (env.ENV_SHOW_CONSOLE) console.log("[REQUEST]  " + utils.getDateTime().toString() + " Collection: " + collectionName + ", ID: " + id + " w/ Request=" + request.url);
    //     !error ? results !== null ? responseMetadata(request, response, results, next) : utilsHttp.notFound(request, response) : ex.handleError(request, response, error);
    // });
};

module.exports.getDocumentByKey = function (request, response) {
    let collectionName = request.params.collection;
    let key = request.params.key;
    let id = request.params.id;

    if (!request.query.$inlinecount) { request.query.$inlinecount = true; }

    //TODO:  Customize key/id specific to your application.
    switch (key) {
        case 'id':
            query.filter['_id'] = id;
            break;
        case 'lastname':
            query.filter['lastName'] = id;
            break;
        default:
            utilsHttp.notImplemented(request, response);
    }    

    //TODO:  Requires implementation w/o Breeze
    // query.execute(db.get(), collectionName, function (error, results, next) {
    //     if (env.ENV_SHOW_CONSOLE) console.log("[REQUEST]  " + utils.getDateTime().toString() + " Collection: " + collectionName + ", ID: " + id + " w/ Request=" + request.url);
    //     !error ? results !== null ? responseMetadata(request, response, results, next) : utilsHttp.notFound(request, response) : ex.handleError(request, response, error);
    // });
};

function responseMetadata(request, response, item, next) {
    let requestTop = 0,
        requestSkip = 0,
        perPage = 0,
        totalResults = 0;

    if (item !== null) { item.Results ? totalResults = item.InlineCount : totalResults = 1; }
    !request.query.$top ? requestTop = 0 : requestTop = request.query.$top;
    !request.query.$skip ? requestSkip = 0 : requestSkip = request.query.$skip;

    if (requestTop >= env.RESPONSE_LIMIT && totalResults > requestTop || requestTop === 0 && totalResults !== 1) {
        perPage = env.RESPONSE_LIMIT;
    }
    else if (requestTop < totalResults && totalResults !== 1) {
        perPage = requestTop;
    }
    else {
        perPage = totalResults;
    }

    let currentPage = 1;
    requestSkip === 0 ? currentPage = 1 : currentPage = Math.ceil(requestSkip / perPage);
    if (totalResults > 0) { var numberOfPages = Math.ceil(totalResults / perPage); }

    let metadata = {
        page: currentPage,
        count: totalResults,
        per_page: perPage,
        number_pages: numberOfPages,
        time: new Date().toISOString(),
        target: env.ENV_TARGET
    };

    response.setHeader("Access-Control-Allow-Origin", env.RESPONSE_ACCESSCTRL);
    let acceptType = request.get('accept');

    try {
        if (acceptType.includes(',')) {
            let acceptTypes = acceptType.split(',');
            acceptType = acceptTypes[0];
        }

        switch (acceptType) {
            case 'text/html':
                response.setHeader("Content-Type", "text/html");
                !item.Results ? response.status(200).send({ results: [item], pagination: metadata }) : response.status(200).send({ results: item.Results, pagination: metadata });
                break;
            case 'application/json':
                response.setHeader("Content-Type", "application/json");
                !item.Results ? response.status(200).json({ results: [item], pagination: metadata }) : response.status(200).json({ results: item.Results, pagination: metadata });
                break;
            case 'application/xml':
                response.setHeader("Content-Type", "application/xml");
                !item.Results ? response.status(200).send(js2xml.parse("Dataset", { results: [item], pagination: metadata })) : response.status(200).send(js2xml.parse("Dataset", { results: item.Results, pagination: metadata }));
                break;
            default:
                utilsHttp.notSupported(request, response);
        }
    }
    catch (err) {
        throw err;
    }
}