const {Router} = require('express')
const { authentication, getUsers } = require("../controllers/userController")
const verifyJWT = require('../middleware/verifyJWT')

const router = Router()

//the routes to handle the send requests :
//router.get("/users", getUsers)
router.post("/autentication", authentication)
router.get("/jibUsers", verifyJWT, getUsers)
//router.get("/jibUsers", getUsers)

module.exports = router