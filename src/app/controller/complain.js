const Complain = require('../model/complain')
const asyncHandler = require('../middleware/async_handler')
const {pagination} = require('../repository/common')
const e = module.exports

//@desc initiating new complain by users
//@route POST /complain/raise
//@access user, society_admin
e.raise = asyncHandler(async (req, res, next) => {

    const loggedInUser = req.user
    const raisedComplain = new Complain({
        name: req.body.name,
        description: req.body.description,
        priority: req.body.priority,
        toUser: loggedInUser.createdBy,
        fromUser: loggedInUser._id.toString(),
    })
    await raisedComplain.save();
    return res.success({})
})


//@desc fetching all complains by user and society_admins
//@route GET /complain/fetch
//@access user, society_admin
e.fetch = asyncHandler(async (req, res, next) => {


    const complainStatus = req.query.complainStatus

    const loggedInUser = req.user
    let query;
    if (loggedInUser.role === "society_admin")
        query = Complain.find({toUser: loggedInUser._id.toString(),})
    else query = Complain.find({fromUser: loggedInUser._id.toString()})

    if(complainStatus !== '0') query.find({status : complainStatus})


    query.populate("toUser").populate("fromUser")

    query.sort({status : -1})


    const total =await Complain.countDocuments()
    const paginationData = await pagination(req, query,total)


    return res.success({
            complains : paginationData.documents,
            count : paginationData.count,
            pagination : paginationData.pagination
        })

})


//@desc updating complain status by society admin
//@route POST /complain/update-status
//@access user, society_admin
e.updateStatus = asyncHandler(async (req, res, next) => {
    const status = req.body.status
    const complainId = req.body.complainId
    const updateObj = {status: status}
    Complain.findOneAndUpdate({_id: complainId}, {$set: updateObj}, function (err, doc) {
        if (err) return res.failed()
        return res.success({
            message: "Complain updated successfully",
        })
    })
})

