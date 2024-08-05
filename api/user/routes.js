const express = require("express")
const {registerUser, loginUser, logout, fetchUserDetails} = require("./controller");
const authenticate = require("../authenticate");

const router = express.Router();



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/fetchUserDetails", authenticate, fetchUserDetails);


module.exports = router;