const express = require('express')
const router = express.Router()
const { googleHandler, googleRedirect } = require("../controllers/oauthController")

//@@ GOOGLE

// [GET] /api/oauth2/google
router.route("/google").get(googleRedirect)

// [GET] /api/oauth2/google/callback
router.route("/google/callback").get(googleHandler)
router.route("/google/error").get((req, res, next) => res.send({ message: "failure" }))


//@@ FACEBOOK

// [GET] /oauth2/authorize/facebook
// router.route("/facebook").get()

// [GET] /oauth2/authorize/facebook/callback


module.exports = router