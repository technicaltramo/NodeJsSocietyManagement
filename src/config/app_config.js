const dotEnv = require('dotenv')
dotEnv.config({path: './config.env'})

let HOST;
let PORT;
let MONGO_URL;
let LOG_LEVEL;
let SUPER_SECRET_KEY;

if (process.env.NODE_ENV === 'production') {
    HOST = "127.0.0.1";
    PORT = 5000;
    MONGO_URL = process.env.CONNECTION_STRING;
    LOG_LEVEL = process.env.LOG_LEVEL;
    SUPER_SECRET_KEY = process.env.SUPER_SECRET;
} else {
    HOST = "127.0.0.1"
    PORT = 5000
    MONGO_URL = "mongodb://localhost:27017/societyManagement?"
    LOG_LEVEL = "debug"
    SUPER_SECRET_KEY = "superSuperSecret"
}

module.exports = {

    TRAMO_BILL_CREDENTIAL : {
        API_TOKEN : process.env.TRAMO_API_TOKEN,
        SECRET_KEY : process.env.TRAMO_SECRETE_KEY,
        USER_ID : process.env.TRAMO_USER_ID,
        MOBILE : process.env.TRAMO_MOBILE_NUMBER
    },
    HOST:HOST,
    PORT:PORT,
    MONGO_URL:MONGO_URL,
    LOG_LEVEL:LOG_LEVEL,
    SUPER_SECRET_KEY:SUPER_SECRET_KEY,
}
