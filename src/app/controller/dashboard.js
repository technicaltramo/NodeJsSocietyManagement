const asyncHandler = require('../middleware/async_handler')
const User = require('../model/user')
const Complain = require('../model/complain')

const e = module.exports

e.init= asyncHandler(async (req,res,next)=>{

    //total user count
    const userCount = await User.countDocuments()
    // total pending complain count
    const pendingComplainCount = await Complain.find({status : 3}).countDocuments()

    return res.success({userCount,pendingComplainCount})

})
