const {visitorEntryNotification} = require('../service/firebase/visitor')
const User = require('../model/user')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const path = require('path')
const asyncHandler = require('../middleware/async_handler')
const {newVisitorEntry, visitorAcceptRejectSaveInfo} = require('../repository/visitor')

const e = module.exports

e.newVisitorEntry = asyncHandler(async (req, res, next) => {

    const createdVisitor = newVisitorEntry(req)
    await createdVisitor.save();
    const toUser = await User.findOne(
        {_id: ObjectId(req.body.toUser), fcmToken: {$exists: true}})
    if (toUser === null)
        return res.failed("User is not logged In yet, Please contact manually")

    const notificationData = {
        type: "visitor",
        subtype: "request",
        token: toUser.fcmToken,
        userId: toUser._id.toString(),
        guardId: req.user._id.toString(),
        visitorId: createdVisitor._id.toString(),
        visitorName: req.body.name,
        visitorMobile: req.body.mobile,
        vehicleNumber: req.body.vehicleNumber,
        picUrl: "visitor/" + path.basename(req.file.path),
        timeInMilliSecond: Date.now().toString(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
    }

    const message = await visitorEntryNotification(notificationData)
    return res.success({message})
})

e.onAcceptReject = asyncHandler(async (req, res, next) => {


})
