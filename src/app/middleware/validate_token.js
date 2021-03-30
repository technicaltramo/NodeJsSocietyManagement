const jwt = require("jsonwebtoken");
const logger = require("../../util/logger");
const {SUPER_SECRET_KEY} = require('../../config/app_config')

module.exports = function (req, res, next) {
    try {

        if (req.url === "/user/create" || req.url === "/user/login") return next()

        const token = req.headers.authorization;
        if (token) {
            return jwt.verify(token, SUPER_SECRET_KEY, function (err, decoded) {
                if (err) {
                    logger.error(err);
                    return res.unauthorized();
                }
                req.user = decoded;
                return next();
            });
        }
        return res.unauthorized();
    } catch (e) {
        next(e)
    }
};
