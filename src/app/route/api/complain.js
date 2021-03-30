const express = require('express')
const router = express.Router()
const {raise,fetch,updateStatus} = require('../../controller/complain')

router.post('/raise-complain',raise)
router.get('/all',fetch)
router.post('/update-status',updateStatus)
module.exports = router