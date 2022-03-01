const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    reserveMoney: {
        type: Number,
        required: true
    },
    bidHistory: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("auctionUsers", userSchema)