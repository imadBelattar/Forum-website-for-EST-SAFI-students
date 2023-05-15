const {Router} = require('express')
const { getUsers } = require("../controllers/userController")

const router = Router()

router.get("/api/users", getUsers)

module.exports = router