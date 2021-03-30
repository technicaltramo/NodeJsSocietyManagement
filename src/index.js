const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config/app_config')
const cors = require('cors')
const passport = require('passport')
const server = require('http').createServer(app);


app.use(express.static('src/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());
app.use(passport.initialize({}));

require('../src/config/mongoose')(app)
require('./app/route/index')(app)
require('./app/middleware/error_handling')(app)


app.get("/m_test", async (req,res,next)=>{
   const Provider =  require('./app/model/provider')
    return res.success({
        providers :await Provider.aggregate([
            {$group : {
                _id : "$serviceType"
                }}
        ])
    })
})


const PORT = config.PORT
server.listen(PORT, () => {
    console.log("App started listening.. @" + PORT)
    require('./app/service/socket/group_chat')
    require('../src/app/service/firebase/firebase_config').config()
    require('../src/app/service/scheduler/job_scheduler').everyFirstOfMonth()
})

module.exports = server








