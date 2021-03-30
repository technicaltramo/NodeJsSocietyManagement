const express = require('express')
const router = express.Router()
const {
    createExpense,
    fetchExpenses,
    updateExpense,
    sendNotification
} = require('../../controller/expense')

router.post('/create',createExpense)
router.get('/fetch-all', fetchExpenses)
router.post('/update', updateExpense)

module.exports = router