const Expense = require('../model/expense')
const {FrontEndValidationError} = require("../../util/exception");
const {validationResult} = require('express-validator')
const User = require('../model/user')
const asyncHandler = require('../middleware/async_handler')

const {addNewExpense} = require('../repository/expense')

const e = module.exports

//@desc creating new expense
//@route GET /expense/create
//@access society_admin
e.createExpense = asyncHandler( async (req,res,next)=>{

    const errMsg = validationResult(req)
    if (!errMsg.isEmpty()) throw new FrontEndValidationError(errMsg)

    //create expense
    const createdExpense = addNewExpense(req)
    await createdExpense.save();
    return res.success({
        expense: createdExpense,
    })
})

//@desc fetching all expenses
//@route GET /expense/fetch-all
//@access society_admin
e.fetchExpenses= asyncHandler(async (req,res,next)=>{
    const currentMonthExpense = req.query.currentMonthExpense;

    if (currentMonthExpense === 'true') {
        const expenses = await Expense.find({isSelectedForCurrentMonth: true})
        return res.success({
            expenses: expenses,
            hello: "dev"
        })
    } else {
        const expenses = await Expense.find()
        return res.success({
            expenses: expenses
        })
    }
});

//@desc updating expenses fields
//@route GET /expense/update
//@access society_admin
e.updateExpense = asyncHandler(async (req,res,next)=>{
    const errMsg = validationResult(req)
    if (!errMsg.isEmpty()) throw new FrontEndValidationError(errMsg)
    await Expense.findOneAndUpdate({_id: req.body._id}, req.body, function (error, place) {
        if (!error)
            return res.success({
                message: "expense updated successfully!",
            })
        else return res.failed()
    })
})

//@desc send notification to select user
// --for expense for the month
//@route GET /expense/send-notification
//@access society_admin
