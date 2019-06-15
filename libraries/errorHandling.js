// TODO:  Currently not implemented.
const path = require('path'),
      env = require('dotenv').config({ path: path.join(__dirname, './.env') });

module.exports = {
    handleError: function (request, response, error) {
        if (env.ENV_SHOW_CONSOLE) console.error(error);
        //logError();
        utilsHttp.serverError(request, response);
    },

    logError: function (httpCode, errorMessage, stackTrace) {
        
    }
};