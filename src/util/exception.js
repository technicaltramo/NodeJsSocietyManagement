class ExistInDBError extends Error {
    constructor(message, options = {}) {
        super(message);

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 404
    }
}

class FrontEndValidationError extends Error {
    constructor(messages, options = {}) {

        let message = "Validation Failed : "
        const errors = messages.errors
        const errorsLength = errors.length
        errors.forEach((error, index) => {
            if (errorsLength === index + 1)
                message = message + error.msg
            else message = message + error.msg + ", "
        })
        super(message);

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 404
    }
}

class InternalServerError extends Error{
    constructor(message= "Something went wrong") {
        super(message);
    }
    get statusCode(){return 500}
}

class UnauthorizedError extends Error{
    constructor(message= "unauthorized error") {
        super(message);
    }
    get statusCode(){return 401}
}

class UnknownError extends Error{
    constructor(message= "unknown error") {
        super(message);
    }
    get statusCode(){return -200}
}

module.exports.UnauthorizedError= UnauthorizedError
module.exports.UnknownError= UnknownError
module.exports.InternalServerError= InternalServerError
module.exports.ExistInDBError = ExistInDBError
module.exports.FrontEndValidationError = FrontEndValidationError