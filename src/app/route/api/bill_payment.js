const express = require('express')
const router = express.Router()
const validateToken = require('../../middleware/validate_token')
const {
    fetchProvider,
    fetchElectricityStateName,
    fetchBill
} = require('../../controller/bill_payment')


router.get('/fetch-provider', validateToken, fetchProvider)
router.get('/fetch-electricity-state', validateToken,fetchElectricityStateName)
router.get('/fetch-bill-info',validateToken,fetchBill)
module.exports = router