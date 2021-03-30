const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')

const VisitorSchema = new mongoose.Schema({

    byGuard : {type : mongoose.Types.ObjectId,ref : Collection.USER,required:true},
    toUser : {type : mongoose.Types.ObjectId,ref : Collection.USER,required:true},
    name : {type : String},
    mobile : {type : String},
    picUrl : {type : String},
    vehicleNumber : {type : String},
    status : {type : Number, default : 3, enum : [1,2,3]}

},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.VISITOR, VisitorSchema)