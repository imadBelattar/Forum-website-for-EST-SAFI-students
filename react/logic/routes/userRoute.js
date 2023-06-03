const { Router } = require("express");
const { authentication, getUsers } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = Router();

//the routes to handle the send requests :
router.post("/autentication", authentication);



module.exports = router;
