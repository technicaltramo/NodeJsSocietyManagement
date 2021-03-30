const Visitor = require('../model/visitor')
const path = require('path')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const e = module.exports

e.newVisitorEntry = (req) => {
    const body = req.body
    return new Visitor({
        byGuard: req.user._id.toString(),
        toUser: body.toUser,
        name: body.name,
        mobile: body.mobile,
        picUrl: path.basename(req.file.path),
        vehicleNumber: body.vehicleNumber,
    })
}

e.visitorAcceptRejectSaveInfo = async (req) => {

    //status
    const acceptValue = req.body.isAccept
    const status = (acceptValue === 'true') ? 1 : 2

    return Visitor.findOneAndUpdate(
        {_id: ObjectId(req.body.visitorId)},
        {status: status})
}