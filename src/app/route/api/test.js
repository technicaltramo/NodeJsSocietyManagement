const express = require('express')
const router = express.Router()
const {expenseReportTest} = require('../../controller/test')


router.get('/expense-reports',expenseReportTest)
module.exports = router