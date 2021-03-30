const express = require('express')
const router = express.Router()
const {init}=require('../../controller/dashboard')

router.get('/init',init)

module.exports = router