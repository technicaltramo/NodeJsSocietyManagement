const {MONGO_URL} = require('./app_config')
const mongoose = require("mongoose");



module.exports = async function (app) {

    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex : true,
        socketTimeoutMS: 30000,
        keepAlive: true,
        reconnectTries: 30000
    }
    await mongoose.connect(MONGO_URL, mongoOptions)

    mongoose.Promise = global.Promise;
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGHUP', cleanup);

    if (app) app.set("mongoose", mongoose);

};

function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}
