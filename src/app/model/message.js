const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')

const MessageSchema = new mongoose.Schema({
    message: {type: String, required: [true, "message required"]},
    toUser: {type: mongoose.Types.ObjectId, ref : Collection.USER,required : true},
    fromUser: {type: mongoose.Types.ObjectId, ref : Collection.USER,required : true}

},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.Message, MessageSchema)