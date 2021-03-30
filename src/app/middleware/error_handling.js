const {UnauthorizedError,InternalServerError} = require("../../util/exception");
const {ExistInDBError, FrontEndValidationError} = require('../../util/exception')

function errorLogs(err, req, res, next) {
    console.log("error : " + err.message)
    next(err)
}

function clientErrorHandler(err, req, res, next) {

    if (err instanceof ExistInDBError) {
        res.json({status: 10, message: err.message});
    } else if (err instanceof FrontEndValidationError) {
        res.json({status: 11, message: err.message})
    } else next(err)

}
function handleApiCallError(err,req,res,next) {
    if(err instanceof InternalServerError)
        res.serverError("Internal server error(s)")
    else if(err instanceof UnauthorizedError){
        res.failed("Something went wrong!(s)")
    }
}

function errorHandler(err, req, res, next) {
    res.status(500).json({
        status: 12,
        message: "Internal server error",
        error : err.message
    })
}

module.exports = (app) => {
    app.use(errorLogs)
    app.use(clientErrorHandler)
    app.use(handleApiCallError)
    app.use(errorHandler)
}
