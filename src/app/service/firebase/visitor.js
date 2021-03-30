const admin = require('firebase-admin')

module.exports.visitorEntryNotification = async (data) => {

    const token = data.token
    const payload = {data : data}
    const option = {priority: "high", timeToLive: 60 * 60 * 24}
    await admin.messaging().sendToDevice(token, payload, option)
     return "Success"

}

