const axios = require('axios').default
const ApiConstant = require('../../../util/constant').Api
const appConfig = require('../../../config/app_config')
const  {onRequestInterceptor,onRequestError} = require('./request_interceptor')
const {onResponseInterceptor,onResponseError} = require('./response_interceptor')

axios.defaults.headers.post["Content-Type"] = "application/json";


//Create global api call instance
const instance = axios.create({
    baseURL: ApiConstant.tramoBillApi.baseUrl,
    timeout : 0,
});

//Request Interceptor
instance.interceptors.request.use(onRequestInterceptor,onRequestError)

//Response Interceptor
instance.interceptors.response.use(onResponseInterceptor,onResponseError)

module.exports.apiClient = instance