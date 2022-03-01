const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    bids: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("auctions", userSchema)