const appConfig = require('../../../config/app_config')
const tramoBillConfig = appConfig.tramoBillConfig

module.exports.onRequestInterceptor = async (config)=> {

    if(config.data == null) config.data = {}
    config.data.api_token = tramoBillConfig.apiToken
    config.data.secretekey = tramoBillConfig.secreteKey
    config.data.userId = tramoBillConfig.userId


    //PRINT LOGS
    console.log("/************************ STARTING API CALL ...************************/")
    console.log("METHOD : "+config.method)
    console.log("URL : "+config.baseURL + config.url)
    console.log("REQUEST DATA : "+JSON.stringify(config.data,null,2))

    return config
}

module.exports.onRequestError=(error)=> {

}