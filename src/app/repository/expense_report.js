const ExpenseReport = require('../model/expense_report')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

class ExpenseReportService {

    static async fetchExpensesMonthlyView(req) {

        const year = Number.parseInt(req.query.year)

        return ExpenseReport.aggregate([
            //pipeline1 ->match
            {
                $match: {
                    year: year,
                    adminId: ObjectId(req.user._id.toString())
                }
            },
            //pipeline2 ->unwind(paymentInfo)
            {$unwind: "$paymentInfo",},
            {
                $lookup: {
                    from: "users",
                    localField: "paymentInfo.userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            //pipeline3 ->unwind(userDetails)
            {$unwind: "$userDetails"},
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        month: "$month",
                        expenses: "$expenses",
                        year: "$year",

                    },
                    info: {
                        $push: {
                            'paidAmount': "$paymentInfo.paidAmount",
                            'paymentAt': '$paymentInfo.paymentAt',
                            'paymentStatus': '$paymentInfo.paymentStatus',
                            'userDetails': "$userDetails"
                        }
                    }
                }
            },
            //pipeline4 ->project
            {
                $project: {
                    active: "$_id.active",
                    _id: "$_id._id",
                    month: "$_id.month",
                    year: "$_id.year",


                    paidUserPaymentInfo: {
                        "$filter": {
                            "input": "$info",
                            "as": "va",
                            "cond": {"$eq": ["$$va.paymentStatus", 1]}
                        }

                    },
                    unpaidUserPaymentInfo: {
                        "$filter": {
                            "input": "$info",
                            "as": "va",
                            "cond": {"$eq": ["$$va.paymentStatus", 2]}
                        }

                    },
                    expenses: "$_id.expenses",
                    paymentInfo: "$info",


                }
            },
            //pipeline5 ->project
            {
                $project: {

                    _id: 1,
                    month: 1,
                    year: 1,
                    paidUserIds: "$paidUserPaymentInfo.userDetails._id",
                    unpaidUserids: "$unpaidUserPaymentInfo.userDetails._id",
                    expenses: 1,
                    totalAmount: {$sum: "$expenses.amount"},
                    paymentInfo: 1,
                    totalUsersCount: {$size: "$paymentInfo"},
                }
            },
            {
                $sort: {month: 1}
            }
        ])
    }

    static async fetchExpensesYearlyView(req) {

        const year = Number.parseInt(req.query.year)

        return ExpenseReport.aggregate([
            {$match: {year: year, adminId: ObjectId(req.user._id.toString())}},
            {$unwind: "$paymentInfo"},
            {
                $group: {
                    _id: {
                        _id: "$paymentInfo.userId",
                        'userId': '$paymentInfo.userId',
                        'totalAmount': {$sum: "$expenses.amount"},
                    },
                    info: {
                        $push: {
                            'month': "$month",
                            'paidAmount': "$paymentInfo.paidAmount",
                            'paymentAt': '$paymentInfo.paymentAt',
                            'paymentStatus': '$paymentInfo.paymentStatus',
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    userId: "$_id.userId",
                    mCount: "$_id.a",
                    totalAmount: "$_id.totalAmount",
                    paymentInfo: "$info",

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },

            {$project: {
                _id: 0,
                    userId: 0,
                }},


            {
                $sort: {
                    "_id.month": 1
                }
            },
            {
                $unwind: "$userDetails"

            }
        ])
    }

    static async fetchExpensesYearlyView_bkc(req) {

        const year = Number.parseInt(req.query.year)
        return ExpenseReport.aggregate([
            {
                $match: {
                    year: year,
                    adminId: ObjectId(req.user._id.toString())
                }
            },
            {
                $unwind: "$paymentInfo"
            },
            {
                $group: {
                    _id: {
                        _id: "$paymentInfo.userId",
                        'userId': '$paymentInfo.userId',
                        'totalAmount': {$sum: "$expenses.amount"},
                    },
                    info: {
                        $push: {
                            'month': "$month",
                            'paidAmount': "$paymentInfo.paidAmount",
                            'paymentAt': '$paymentInfo.paymentAt',
                            'paymentStatus': '$paymentInfo.paymentStatus',
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    userId: "$_id.userId",
                    mCount: "$_id.a",
                    totalAmount: "$_id.totalAmount",
                    paymentInfo: "$info",

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $sort: {
                    "_id.month": 1
                }
            }
        ])
    }

    static async perUserExpenseReport(req){
        return ExpenseReport.aggregate([
            {$match: {year: 2020,}},
            { $project: {
                year : 1,
                    month : 1,
                    expenses : 1,
                    list: {$filter: {
                            input: '$paymentInfo',
                            as: 'item',
                            cond: {$eq: ['$$item.userId', ObjectId(req.user._id) ]}
                        }}
                }},
            {$unwind : "$list"},

            {
               $project: {
                   year : 1,
                   month : 1,
                   expenses : 1,
                   paymentAt : "$list.paymentAt",
                   paymentStatus : "$list.paymentStatus",
                   totalAmount: {$sum: "$expenses.amount"},

               }
            }
        ])
    }
}

module.exports = ExpenseReportService