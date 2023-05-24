const { Router } = require("express");
const { authentication, getUsers } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = Router();

//the routes to handle the send requests :
//router.get("/users", getUsers)
router.post("/autentication", authentication);
router.get("/jibUsers", verifyJWT, getUsers);
router.get("/getUserQuestions", verifyJWT, (req, res) => {
  res.status(201).json([
    {
      statement: "how to connect ReactJs with Express Nond.JS SERVER ?",
      description: "any ideas",
    },
    {
      statement: "what is the role of malok() in c++ ?",
      description: "please I need a response because I am struggling in my tests",
    },
  ]);
});
//router.get("/jibUsers", getUsers)

module.exports = router;
