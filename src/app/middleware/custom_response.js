const customResponses = {
    success( data ) {
        if(data) {
            data.status = 1;
            if(!data.message) data.message = "Success"
            if(!data.status) data.status = 1

        }
        else data = {
            status : 1,
            message : "success"
        }
        return this.status( 200 ).json(data);
    },
    failed(message = "something went wrong!") {
        return this.status( 200 ).json( {
            status : 2,
            message: message,
        } );
    },

    unauthorized( ) {
        return this.status( 401 ).json( {
            status : 401,
            message: "unauthorized",
        } );
    },

    preconditionFailed( customError ) {
        return this.status( 412 ).json({
            status : 412,
            message: customError || "precondition_failed",
        });
    },

    validationError( error ) {
        if ( !error || !error.errors ) {
            return this.serverError( );
        }

        let errorResponse = { };
        const typeFields = extractValidationType( error.errors );
        if ( typeFields.length > 0 ) {
            errorResponse = typeFields;
        }

        return this.unprocessableEntity( errorResponse );
    },

    blocked( ) {
        return this.status( 410 ).json( {
            status : 410,
            message: "version_blocked",
        } );
    },

    unprocessableEntity( customError ) {
        return this.status( 422 ).json( {
            status : 422,
            message: "unprocessable_entity",
            payload: customError,
        } );
    },

    notFound( ) {
        return this.status( 404 ).json( {
            status : 404,
            message: "not_found",
        } );
    },

    serverError(message = "Internal server error") {
        return this.status( 500 ).json( {
            status : 500,
            message: message,
        } );
    },
};

module.exports = ( req, res, next ) => {
    Object.assign( res, customResponses );
    next( );
};

function extractValidationType( errors ) {
    const fields = Object.keys( errors );
    return fields.map( key => errors[ key ] )
                 .map( validation => ( { errorOnField: validation.path, message: validation.message } ) );
}
