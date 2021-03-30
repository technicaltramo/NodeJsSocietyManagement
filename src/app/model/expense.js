const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')

const ExpenseSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Expense name required"]},
    description: {type: String, required: [true, "Expense description required"]},
    amount: {type: Number, required: [true, "Expense Amount required"]},
    type: {
        type: String,
        required: [true, "Expense type required monthly or yearly"],
        default : "monthly",
        enum : ["monthly","yearly"]
    },
    isSelectedForCurrentMonth : {type : Boolean,default : false},

},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.EXPENSE, ExpenseSchema)