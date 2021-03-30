const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')
const ObjectId = mongoose.Types.ObjectId

const ExpenseReportSchema = new mongoose.Schema({
    adminId: {type: ObjectId, ref : Collection.USER, required : true},
    month: {type : Number, required : true,enum : [1,2,3,4,5,6,7,8,9,10,11,12]},
    year: {type:Number,required : true},
    status: {type: Number,default : 2},
    expenses: [{
        _id : 0,
        expenseId : ObjectId,
        name : String,
        description : String,
        amount : Number,
        type : {type : String,default : "monthly", enum : ["monthly","yearly"]}
    }],
    paymentInfo:[{
        _id : 0,
        userId : ObjectId,
        paymentAt : Date,
        paymentStatus : {type : Number,default:0,enum:[0,1]}
    }],

},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.EXPENSE_REPORT, ExpenseReportSchema)