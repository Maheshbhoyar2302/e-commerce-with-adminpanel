const mongoose = require('mongoose')


const connectDatabase = () => {
    mongoose.connect("mongodb://localhost:27017/e_commerce_with_admindashboard", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`Mongodb connected with server:`)
    })
}

module.exports = connectDatabase