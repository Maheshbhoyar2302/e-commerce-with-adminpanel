const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

//Handling uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to uncaught exception`)

    process.exit(1)
})

//config
dotenv.config({path:"backend/config/config.env"})

//connecting database
connectDatabase()

const server = app.listen(4000, () => {
    console.log(`Server is working on 4000`)
})


//unhandled promise rejection
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)

    server.close(()=>{
        process.exit(1)
    })
})