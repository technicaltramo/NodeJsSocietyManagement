const user = require('./api/user')
const complain = require('./api/complain')
const expense = require('./api/expense')
const exenseReport = require('./api/expense_report')
const visitor = require('./api/visitor')
const billPayment = require('./api/bill_payment')
const dashboard = require('./api/dashboard')
const validateToken = require('../middleware/validate_token')
const cr = require('../middleware/custom_response');
const test = require('./api/test')

module.exports = (app)=>{

    app.use(cr)
    app.use(validateToken)
    app.use('/user',user)
    app.use('/complain',complain)
    app.use('/expense',expense)
    app.use('/expense-report',exenseReport)
    app.use('/visitor',visitor)
    app.use('/bill-payment',billPayment)
    app.use('/dashboard',dashboard)
    app.use('/test',test)
}