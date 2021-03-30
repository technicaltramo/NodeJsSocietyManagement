const Provider = require("../model/provider")

const e = module.exports

e.fetchElectricityStateName = async () => Provider.aggregate([
    {$match: {stateName : {$exists : 1}}},
    {
        $group: {
            _id: "$stateName"
        },
    },
    {$project: {_id: 0, stateName: "$_id"}}
])

e.fetchProvider = async (serviceType, stateName = "") => {
    if (stateName !== "") {
        return Provider.find({serviceType: serviceType, stateName: stateName})
    }
    return Provider.find({serviceType: serviceType})
}
