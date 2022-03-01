const validator = require("email-validator")
const bcrypt = require("bcrypt");
const auctionUsers = require("../models/AuctionUserSchema")
const auctions = require("../models/ItemsSchema")


module.exports = {
    validateRegister: async (req, res, next) => {
        const {email, password1, password2} = req.body

        const userExists = await auctionUsers.findOne({email})
        if (userExists) return res.send({success: false, message: "email is taken"})
        if (password1 !== password2) return res.send({success: false, message: "shitty  password deal m8"})

        next()
    },
    validateUserLogin: async (req, res, next) =>  {
        const {email, password} = req.body
        if(!validator.validate(email))
            return res.send({error: true, data: "Email is not valid"})

        const response = await auctionUsers.find({email: email})
        console.log(response)

        if(response[0]){

            const compare = await bcrypt.compare(password, response[0].password)

            if(!compare) {
                return res.send({error: true, data: "Incorrect password"})
            }

            next();

        } else {
            return res.send({error: true, data: "User not found"})
        }

    },
    validateItem: async (req, res, next) => {
        const {image, title, startPrice, duration} = req.body
        if (!req.session.userEmail) return res.send({data: "Not logged in"})
        if(!image.includes('http')) return res.send({data: "incorrect image"})
        if(title.length < 20 || title.length > 500) return res.send({data: "title mus be between 20 and 500 characters long"})
        if(isNaN(startPrice)) return res.send({data: "Starting price has to be a number"})
        if(duration < Date.now()) return res.send({data: "incorrect timing"})
        next()
    },
    validateBid: async (req, res, next) => {
        const {postId, bidValue} = req.body
        const currentAuction = await auctions.find({_id : postId})

        if (!req.session.userEmail) return res.send({data: "Not logged in"})
        if (currentAuction[0].price > bidValue) return res.send({data: "bid is too small"})
        else{
            next()
        }
    },
    validateLoggedIn: async (req, res, next) => {
        if(!req.session.userEmail) return res.send({data: "You have to Log in"})
        next()
    }
}

