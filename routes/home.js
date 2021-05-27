const express = require("express")
const router = express.Router()
const homeControlles = require('../controlles/home/home')

router.get('/searching',homeControlles.searching)
router.get('/',homeControlles.homePage)
module.exports = router