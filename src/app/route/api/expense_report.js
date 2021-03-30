const express = require('express')
const router = express.Router()
const {fetchExpensesMonthlyView,fetchExpensesYearlyView,perUserExpenseReport} = require('../../controller/expense_report')


router.get('/fetch-expenses-yearly-view',fetchExpensesYearlyView)
router.get('/fetch-expenses-monthly-view',fetchExpensesMonthlyView)
router.get('/per-user-report',perUserExpenseReport)


module.exports = router