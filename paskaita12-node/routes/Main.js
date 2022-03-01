const express = require('express')
const router = express.Router()

const {validateUserLogin, validateRegister, validateItem, validateBid, validateLoggedIn} = require("../middleware/main")
const {register, login, listItem, getAuctions, getSingleAuction, submitBid, getMyAuctions, getUserBids} = require("../controllers/main")

router.post('/register', validateRegister, register)
router.post('/login', validateUserLogin, login)

router.get('/getItems', getAuctions)
router.get('/getMyAuctions', getMyAuctions)
router.get('/getSingleAuction/:id', getSingleAuction)

router.post('/listItem', validateItem, listItem)
router.post('/submitBit', validateBid, submitBid)
router.get('/getUserBids', validateLoggedIn, getUserBids)



module.exports = router