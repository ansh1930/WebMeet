const mongoose = require('mongoose')

let credentials = new mongoose.Schema({
    GoogleId:Number,
    DisplayName:String,
    Name:String,
    Email:String,
    Provider:String
})

// Create the mongoose Model
let WebMeet_credentials = mongoose.model('WebMeet_credentials',credentials,'passport')

module.exports=WebMeet_credentials;