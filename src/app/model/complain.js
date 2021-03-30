const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')
const ObjectId = mongoose.Types.ObjectId

const ComplainSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Complain name required"]},
    description: {type: String, required: [true, "Complain description required"]},
    priority: {
        type: String,
        default : "medium",
        enum : ["low","normal","high"],
    },
    status : {type : Number,default : 3,enum : [1,2,3]},
    toUser: {type: ObjectId, ref : Collection.USER,required : true},
    fromUser: {type:ObjectId, ref : Collection.USER,required : true}

},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.COMPLAIN, ComplainSchema)