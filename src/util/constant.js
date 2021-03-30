const Constants = module.exports


Constants.Collection = {
    USER : "user",
    Message : "message",
    COMPLAIN : "complain",
    EXPENSE : "expense",
    EXPENSE_REPORT : "expense_report",
    VISITOR : "visitor",
    PROVIDER : "provider",
}


Constants.Api = {
    tramoBillApi : {
        baseUrl : "https://www.comrade.tramo.in/api/v2/bill/",
        fetchProvider : "get-provider",
        fetchBillInfo : "fetch"
    }
}