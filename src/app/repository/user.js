const User = require('../model/user')
const Expense = require('../model/expense')
const mongoose = require('mongoose')
const ExpenseReport = require('../model/expense_report')
const ObjectId = mongoose.Types.ObjectId;
const ExcelJs = require('exceljs')

const e = module.exports

e.createUser = async (req) =>{
    const user = req.user
    const body = req.body
    body.password = "123456"

    return new User({
        name: body.name,
        mobile: body.mobile,
        password: body.password,
        email: body.email,
        role: body.role,
        aadhaarNumber: body.aadhaarNumber,
        flatNo: body.flatNo,
        createdBy: user._id.toString(),
        societyInfo: (user.role === "app_admin") ? body.societyInfo : {}
    })
}


e.fetchUser = async (req) =>{
    const adminId = req.query.adminId
    const mType = typeof adminId

    if(mType !=="undefined" && adminId !== "")
        return User.find({createdBy : req.query.adminId})
    else return User.find({createdBy : ObjectId(req.user._id.toString())})
}
e.usersByAdminId = async (id)=> User.find({createdBy: id})


e.importUserExcelData = async (filePath)=>{
    const workbook = new ExcelJs.Workbook()
    const mFile = await workbook.xlsx.readFile(filePath)
    const worksheet = mFile.getWorksheet("Sheet1")

    const mArray = []
    worksheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
        const name = row.getCell(2).value
        const mobile = row.getCell(3).value
        const aadhaarNumber = row.getCell(4).value
        const email = row.getCell(5).value
        const towerNo = row.getCell(6).value
        const flourNo = row.getCell(7).value
        const flatNo = row.getCell(8).value
        const totalMember = row.getCell(9).value
        const role = row.getCell(10).value
        const guardAddress = row.getCell(11).value
        const userObject = {
            name: name,
            email: email,
            mobile: mobile,
            aadhaarNumber: aadhaarNumber,
            towerNo: towerNo,
            flourNo: flourNo,
            flatNo: flatNo,
            totalMember: totalMember,
            role: role,
            guardAddress: guardAddress,
        }
        if (rowNumber > 1) mArray.push(userObject)
    });
    return mArray
}

e.createBulkUser = async (mList,adminId)=>{
    const userList = []
    const defaultPassword ="$2a$10$kte.QH1PVFtmtzytdwrjcexinvSp91vbE.t71.S6WqlvwrzYQ8a0W"
    console.log(defaultPassword)
    for (const item of mList) {
        userList.push(User({
            name: item.name,
            mobile: item.mobile,
            password:defaultPassword,
            email: item.email,
            role: item.role,
            aadhaarNumber: item.aadhaarNumber,
            flatNo: item.flatNo,
            guardAddress: item.guardAddress,
            totalMember: item.totalMember,
            towerNo: item.towerNo,
            createdBy: adminId,
        }))
    }
    return await User.insertMany(userList)
}


/*module.exports = class UserService {


    static createUser(req) {

        const user = req.user
        const body = req.body
        body.password = "123456"

        return new User({
            name: body.name,
            mobile: body.mobile,
            password: body.password,
            email: body.email,
            role: body.role,
            aadhaarNumber: body.aadhaarNumber,
            flatNo: body.flatNo,
            createdBy: user._id.toString(),
            societyInfo: (user.role === "app_admin") ? body.societyInfo : {}
        })
    }

    static async usersByPaymentYearMonth(req) {

        const year = req.query.year
        const month = req.query.month

        return User.aggregate([
            {
                "$match": {
                    "paymentInfo": {
                        "$elemMatch": {
                            "$and": [
                                {"year": Number.parseInt(year)},
                                {"month": month},
                            ]
                        }
                    },
                }
            },
            {
                "$project": {
                    "name": 1,
                    "role": 1,
                    "active": 1,
                    "mobile": 1,
                    "password": 1,
                    "email": 1,
                    "aadhaarNumber": 1,
                    "flatNo": 1,
                    "createdBy": 1,
                    "societyInfo": 1,
                    "paymentInfo": {
                        "$filter": {
                            "input": "$paymentInfo",
                            "as": "paymentInfo",
                            "cond": {
                                "$and": [
                                    {"$eq": ["$$paymentInfo.month", month]},
                                    {"$eq": ["$$paymentInfo.year", Number.parseInt(year)]}
                                ]
                            }
                        }
                    }
                }
            }
        ])
    }

    static async fetchUsers(req) {
        try {
            const adminId = req.query.adminId
            const mType = typeof adminId

            if(mType !=="undefined" && adminId !== "")
                return User.find({createdBy : req.query.adminId})
            else return User.find({createdBy : ObjectId(req.user._id.toString())})
        } catch (e) {
            throw e
        }
    }

    static async allSocietyAdmin() {
        return User.find({role: "society_admin"})
    }

    static async previousMonthSelectedExpenses(societyAdminId) {
        return Expense.find({
            createdBy: ObjectId(societyAdminId),
            isSelectedForCurrentMonth: true
        });
    }

    static async insertNewExpenseReport(expenses, societyAdminId) {
        const dateObj = new Date();
        const month = Number.parseInt((dateObj.getUTCMonth() + 1))
        const year = dateObj.getUTCFullYear();

        const paymentInfo = []
        const mUsers = await this.usersByAdminId(societyAdminId)
        for (const item of mUsers) {
            paymentInfo.push({
                userId: ObjectId(item._id.toString()),
                paidAmount: 0,
                paymentStatus: 2,
                paymentAt: ""
            })
        }

        const mExpenses = [];
        for (const element of expenses) {
            mExpenses.push({
                name: element.name,
                amount: element.amount,
                type: element.type
            })
        }

        return ExpenseReport.create({
            adminId: societyAdminId,
            month: month,
            year: year,
            expenses: mExpenses,
            paymentInfo: paymentInfo
        })

    }

    static async usersByAdminId(id) {
        return User.find({createdBy: id})
    }

    static async importUserExcelData(filePath) {
        const workbook = new ExcelJs.Workbook()
        const mFile = await workbook.xlsx.readFile(filePath)
        const worksheet = mFile.getWorksheet("Sheet1")

        const mArray = []
        worksheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
            const name = row.getCell(2).value
            const mobile = row.getCell(3).value
            const aadhaarNumber = row.getCell(4).value
            const email = row.getCell(5).value
            const towerNo = row.getCell(6).value
            const flourNo = row.getCell(7).value
            const flatNo = row.getCell(8).value
            const totalMember = row.getCell(9).value
            const role = row.getCell(10).value
            const guardAddress = row.getCell(11).value
            const userObject = {
                name: name,
                email: email,
                mobile: mobile,
                aadhaarNumber: aadhaarNumber,
                towerNo: towerNo,
                flourNo: flourNo,
                flatNo: flatNo,
                totalMember: totalMember,
                role: role,
                guardAddress: guardAddress,
            }
            if (rowNumber > 1) mArray.push(userObject)
        });
        return mArray
    }

    static async createBulkUser(mList, adminId) {

        const userList = []
        const defaultPassword ="$2a$10$kte.QH1PVFtmtzytdwrjcexinvSp91vbE.t71.S6WqlvwrzYQ8a0W"
        console.log(defaultPassword)
        for (const item of mList) {
            userList.push(User({
                name: item.name,
                mobile: item.mobile,
                password:defaultPassword,
                email: item.email,
                role: item.role,
                aadhaarNumber: item.aadhaarNumber,
                flatNo: item.flatNo,
                guardAddress: item.guardAddress,
                totalMember: item.totalMember,
                towerNo: item.towerNo,
                createdBy: adminId,
            }))
        }
        return await User.insertMany(userList)
    }
}*/
