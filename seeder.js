const arg = process.argv[2]
const mongoose = require('mongoose')
const appConfig = require('./src/config/app_config')
const fs = require('fs')
const us = require('underscore')
const User = require('./src/app/model/user')
const Provider = require('./src/app/model/provider')
const Expense = require('./src/app/model/expense')
const ExpenseReport = require('./src/app/model/expense_report')
const Complain = require('./src/app/model/complain')

if(arg !== "-d" && arg !== "-i"){
    console.log("command not found")
    console.log("* node seeder -i // for import data")
    console.log("* node seeder -d // for delete data")
    return
}

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
}


let userJsonData;
let providersJsonData;
let expensesJsonData;
let expenseReportsJsonData;
let complainsJsonData;

mongoose.connect(appConfig.MONGO_URL, mongoOptions)
    .then(() => {
        readFiles().then(async () => {
           if (arg === "-i") {
                await importData()
                await cleanup()
                console.log("data has imported successfully")
            } else if (arg === '-d') {
                await dropData()
               await cleanup()
                console.log("data has deleted successfully")
            }
        })
    })

async function importData() {
    await importUsers()
    await importProviders()
    await importExpenses()
    await importComplains()
}

async function importComplains(){
    await Complain.insertMany(complainsJsonData)
}

async function importExpenses() {
    await Expense.insertMany(expensesJsonData)
    await ExpenseReport.insertMany(expenseReportsJsonData)

}

async function importUsers() {
    //admin...
    const adminJson =  us.findWhere(userJsonData,{role : "app_admin"})
    const createdAdmin = User(adminJson)
    await createdAdmin.save();

    //society admins...
    const societyAdminJson =  us.findWhere(userJsonData,{role : "society_admin"})
    const createSocietyAdmin = User(societyAdminJson)
    await createSocietyAdmin.save()

    //users
    const userJson = us.where(userJsonData,{role : "user"})
    userJson.map((e) => {
        e.createdBy = createSocietyAdmin._id.toString()
        e.password = "$2a$10$jJFwkMG5I3VfK.23PNohx.evJrFEg7CQlREibbUUmITXekYGwC.2a"
    })
    await User.insertMany(userJson)

    const guardJson = us.where(userJsonData,{role : "guard"})
    guardJson.map((e)=>{
        e.createdBy = createSocietyAdmin._id.toString()
        e.password = "$2a$10$jJFwkMG5I3VfK.23PNohx.evJrFEg7CQlREibbUUmITXekYGwC.2a"
    })

    await  User.insertMany(guardJson)
}

async function importProviders() {
    await Provider.insertMany(providersJsonData)
}


async function dropData() {
    await User.deleteMany({})
    await Provider.deleteMany({})
    await Expense.deleteMany({})
    await ExpenseReport.deleteMany({})
    await Complain.deleteMany({})
}


async function readFiles() {
    userJsonData = JSON.parse(fs.readFileSync(`${__dirname}/src/public/seed/users.json`, 'utf-8'))
    providersJsonData = JSON.parse(fs.readFileSync(`${__dirname}/src/public/seed/providers.json`, 'utf-8'))
    expensesJsonData = JSON.parse(fs.readFileSync(`${__dirname}/src/public/seed/expenses.json`, 'utf-8'))
    expenseReportsJsonData = JSON.parse(fs.readFileSync(`${__dirname}/src/public/seed/expense_reports.json`, 'utf-8'))
    complainsJsonData = JSON.parse(fs.readFileSync(`${__dirname}/src/public/seed/complains.json`, 'utf-8'))

}

async function cleanup() {
    await mongoose.connection.close(function () {
        process.exit(0);
    });
}


