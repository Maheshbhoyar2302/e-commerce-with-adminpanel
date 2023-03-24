const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

//config
dotenv.config({path:"backend/config/config.env"})

//connecting database
connectDatabase()

app.listen(4000, () => {
    console.log(`Server is working on 4000`)
})
