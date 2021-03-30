const {apiClient} = require('../service/api/api_instance')
const e = module.exports
const tramoBillApi = require('../../util/constant').Api.tramoBillApi


e.fetchBill = async () => {
    const url = tramoBillApi.fetchBillInfo
    return apiClient.post(url, {
        providerKey: "TR98",
        billNumber: "6988215000",
        consumerMobNumber: "7982607742"
    })
}