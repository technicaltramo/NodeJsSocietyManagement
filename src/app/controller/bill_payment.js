const {fetchElectricityStateName, fetchProvider} = require("../repository/provider")
const asyncHandler = require('../middleware/async_handler')
const {fetchBill} = require('../repository/bill_payment')
const { listen } = require("../..")

//@desc
//@route GET /provider/fetch-provider
//@access USER
exports.fetchProvider = asyncHandler(async (req, res, next) => {

    const serviceType = req.query.serviceType
    const stateName = req.query.stateName
    if (serviceType === "ELECTRICITY")
        return res.success({providers: await fetchProvider(serviceType, stateName)})
    else
        return res.success({providers: await fetchProvider(serviceType)})
})

//@desc
//@route GET /provider/fetch-electricity-state
//@access USER
exports.fetchElectricityStateName = asyncHandler(async (req, res, next) => {
    return res.success({stateNames: await fetchElectricityStateName()})
})


//@desc
//@route GET /provider/fetch-bill
//@access USER
exports.fetchBill = asyncHandler(async (req, res, next) => {

    const body = req.body
    const apiResult = await fetchBill()
    return res.success()
})
