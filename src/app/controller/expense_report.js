const ExpenseReportService = require('../repository/expense_report')
const asyncHandler = require('../middleware/async_handler')
const e = module.exports

//@desc fetching expense report data for yearly view
//@route GET /expense-report/fetch-expenses-yearly-view
//@access user,society_admin
e.fetchExpensesYearlyView = asyncHandler(async (req, res, next) => {
    const reports = await ExpenseReportService.fetchExpensesYearlyView(req)
    return res.success({
        reports: reports
    })
})


//@desc fetching expense report data for monthly view
//@route GET /expense-report/fetch-expenses-monthly-view
//@access user,society_admin
e.fetchExpensesMonthlyView = asyncHandler(async (req, res, next) => {
    const reports = await ExpenseReportService.fetchExpensesMonthlyView(req)
    res.success({reports: reports})
})


e.perUserExpenseReport = asyncHandler(async (req,res,next)=>{
    return res.success({reports : await ExpenseReportService.perUserExpenseReport(req)})
})
