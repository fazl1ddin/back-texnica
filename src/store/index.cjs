const Mongoose = require("mongoose")

module.exports = {
    async start(){
        await Mongoose.connect('mongodb+srv://admin:<password>@cluster0.rkm7c48.mongodb.net/?retryWrites=true&w=majority')
    }
}