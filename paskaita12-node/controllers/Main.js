const auctionUsers = require("../models/AuctionUserSchema")
const auctions = require("../models/ItemsSchema")
const crypt = require("bcrypt");
const schedule = require('node-schedule');

const socket = require('../src/app');

let auctionItems = []

// back-end win timer
const getAuctions = async () => {
    auctionItems = await auctions.find({})

    auctionItems.map((auction) => {
        const itemInterval = setInterval(async () => {
            if (Math.floor(new Date(auction.endTime).getTime()) < Date.now()) {
                clearInterval(itemInterval)
                const timeUpItem = await auctions.findOne({_id: auction._id})

                if(timeUpItem.bids[timeUpItem.bids.length-1]) {

                    const lastBid = timeUpItem.bids[timeUpItem.bids.length - 1]

                    const userRecord = {
                        title: "Auction won!!! - " + auction.title,
                        bidValue: lastBid.bidValue,
                        time: Date.now()
                    }

                    await auctionUsers.findOneAndUpdate({email: lastBid.email}, {
                        $push: {bidHistory: userRecord}
                    })
                }
                 else{
                    console.log("wasn't sold")
                }
            }
        }, 1000)
    })
}
getAuctions()


module.exports = {
    register: async (req, res) => {
        const {email, password1} = req.body
        const hash = await crypt.hash(password1, 10)
        try {
            const user = new auctionUsers()
            user.email = email
            user.password = hash
            user.reserveMoney = 0
            user.money = 1500
            user.bidHistory = []
            await user.save()
            res.send({success: true, message: "user was created"})
        } catch (e) {
            console.log(e)
        }
    },
    login: async (req, res) => {
        try {
            const {email} = req.body
            req.session.userEmail = email
            const response = await auctionUsers.find({email: email}).select("-password")

            req.session.userEmail = response[0].email
            console.log(req.session)

            return res.send({
                error: false,
                data: "Login successful",
                id: response[0].id,
                session: req.session,
                response
            })
        } catch (error) {
            return res.send({error: true, data: error})
        }
    },
    listItem: async (req, res) => {

        const {image, title, startPrice, duration} = req.body

        try {
            const auction = new auctions()
            auction.email = req.session.userEmail;
            auction.title = title;
            auction.image = image;
            auction.price = startPrice;
            auction.endTime = duration;
            auction.bids = [];
            console.log(auction.endTime)

            await auction.save()

            auctionItems.push(auction)

            res.send({data: "Jobs done", auctionItems})
            getAuctions()


        } catch (e) {
            console.log(e)
        }
    },
    getAuctions: async (req, res) => {
        const items = await auctions.find({})
        res.send(items)
    },
    getMyAuctions: async (req, res) => {
        const items = await auctions.find({email: req.session.userEmail})
        res.send(items)
    },
    getSingleAuction: async (req, res) => {
        const {id} = req.params
        const item = await auctions.find({_id: id})
        res.send({item})
    },
    submitBid: async (req, res) => {
        const email = req.session.userEmail
        const {bidValue, postId} = req.body

        const bidder = await auctionUsers.findOne({email: email})
        const auction = await auctions.findOne({_id: postId})

        const record = {
            email,
            bidValue,
            time: Date.now(),
            postId
        }

        const userRecord = {
            title: auction.title,
            bidValue,
            time: Date.now(),
        }


        if(auction.bids.length === 0){
            auction.price = bidValue;
            auction.bids.push(record)
            bidder.money -= bidValue;
            bidder.bidHistory.push(userRecord)
            await auctions.replaceOne({_id: postId}, auction, {new: true})
            await auctionUsers.replaceOne({email: req.session.userEmail}, bidder, {new: true})
            res.send({price:record.bidValue, user: bidder})
            socket.ioObject.emit("auction", record)

        } else{

            const lastBidderLog = auction.bids[auction.bids.length-1]
            const lastBidder = await auctionUsers.findOne({email: lastBidderLog.email})


            if(req.session.userEmail === lastBidder.email){

                    auction.price = Number(bidValue)
                    auction.bids.push(record)
                    bidder.money = bidder.money - Number(bidValue) + Number(lastBidderLog.bidValue)
                    bidder.bidHistory.push(userRecord)

                    await auctions.replaceOne({_id: postId}, auction, {new: true})
                    await auctionUsers.replaceOne({email: req.session.userEmail}, bidder, {new: true})


                } else{

                    lastBidder.money += Number(lastBidderLog.bidValue)
                    await auctionUsers.replaceOne({email: lastBidderLog.email}, lastBidder, {new: true})

                    auction.price = Number(bidValue)
                    auction.bids.push(record)
                    bidder.money -= Number(bidValue)
                    bidder.bidHistory.push(userRecord)

                    await auctions.replaceOne({_id: postId}, auction, {new: true})
                    await auctionUsers.replaceOne({email: req.session.userEmail}, bidder, {new: true})

                }

            res.send({price:record.bidValue, user: bidder})
            socket.ioObject.emit("auction", record)

        }


    },
    getUserBids: async (req, res) => {
        const user = await auctionUsers.find({email: req.session.userEmail})
        res.send({bidHistory: user[0].bidHistory, data: "success"})
    }
}

