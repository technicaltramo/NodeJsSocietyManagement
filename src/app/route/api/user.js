const express = require('express')
const router = express.Router()
const excelUpload = require('../../middleware/multer').excelUpload()
excelUpload.single('userExcel')

const {
    createUser,
    updateUser,
    loginUser,
    saveFcmToken,
    fetchUsers,
    fetchStates,
    fetchDistrictsByStateId,
    importUserExelData
} = require('../../controller/user')

router.post('/create', createUser)
router.post('/update', updateUser)
router.post('/login', loginUser)
router.post('/save-fcm-token', saveFcmToken)
router.get('/all', fetchUsers)
router.get('/fetch-all-state',fetchStates)
router.get('/fetch-all-districts-with-state-id',fetchDistrictsByStateId)
router.post('/import-user-data', excelUpload.single('userExcel'), importUserExelData)
module.exports = router

