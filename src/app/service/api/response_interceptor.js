const {UnauthorizedError, InternalServerError, UnknownError} = require("../../../util/exception");
module.exports.onResponseInterceptor = async (response) => {

    const status = response.status
    console.log("hello deva : " + status)

    console.log("RESPONSE DATA : " + JSON.stringify(response.data, null, 2))
    console.log("/************************ ENDING API CALL...************************/")

    if(status === 401)
        throw new Error("Unauthorized error with status code 401")

    return response
}

module.exports.onResponseError = (error) => {

    console.log("onError : " + error)

    console.log("/************************ ENDING API CALL...************************/")

    if (error.toString().includes("500"))
        throw new InternalServerError()
    else if (error.toString().includes("401"))
        throw new UnauthorizedError()
    else new UnknownError()


}