const mongoose = require('mongoose')
const {Collection} = require('../../util/constant')

const ProviderSchema = new mongoose.Schema({
    providerKey : {type : String},
    serviceType : {type : String},
    providerName : {type : String},
},{ timestamps: { createdAt: 'createdAt' } })
module.exports = mongoose.model(Collection.PROVIDER, ProviderSchema)