const Expense = require('../model/expense')
const e = module.exports


e.addNewExpense = (req)=>{
    const body = req.body;
    return new Expense({
        name: body.name,
        description: body.des,
        amount: body.amount,
        type: body.type,
    })
}