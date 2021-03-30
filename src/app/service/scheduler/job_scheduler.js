const schedule = require('node-schedule');

module.exports.everyFirstOfMonth =()=>{
    schedule.scheduleJob('0 0 1 * *', function(){
        console.log('Your scheduled job at beginning of month');
    });
}


