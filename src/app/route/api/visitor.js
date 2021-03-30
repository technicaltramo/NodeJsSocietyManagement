const express = require('express')
const router = express.Router()
const visitorProfile = require('../../middleware/multer').visitorProfile()

const {newVisitorEntry,onAcceptReject}=require('../../controller/visitor')

router.post('/new-visitor-entry',visitorProfile.single("visitorPic"), newVisitorEntry)
router.post("/on-accept-reject",onAcceptReject)


module.exports = router