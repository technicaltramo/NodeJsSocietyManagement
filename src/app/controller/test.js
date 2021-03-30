const e = module.exports
const asyncHandler = require('../middleware/async_handler')

//expense report test
e.expenseReportTest = asyncHandler(async (req, res, next) => {
    const Report = require('../model/expense_report')

    const query = Report.aggregate([
        {$match: {year: 2020}},
        {$unwind: "$paymentInfo"},
        {
            $lookup: {
                from: "users",
                localField: "paymentInfo.userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {$unwind: "$userDetails"},
        {
            $group: {
                _id: {
                    _id: "$_id",
                    month: "$month",
                    year: "$year",
                    expenses: "$expenses"
                },
                mInfo: {
                    $push: {
                        userDetails: "$userDetails",
                        paymentAt: "$paymentInfo.paymentAt",
                        paymentStatus: "$paymentInfo.paymentStatus",
                    }
                }
            }
        },
        {
            $project: {
                _id : "$_id.id",
                month : "$_id.month",
                year : "$_id.year",
                expenses : "$_id.expenses",
                paymentInfo : "$mInfo",
                paidUserIds : {
                    $filter : {
                        input : "$mInfo",
                        as : "value",
                        cond : {$eq : ["$$value.paymentStatus",1]}
                    }
                }
            }
        },
        {
            $sort: {month : 1}
        }

    ])


    const reports = await query
    return res.success({reports: reports})

})


