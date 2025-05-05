const express = require("express")
const {registerUser, loginUser, logout, fetchUserDetails, addBatch, fetchBatches, addBatchTitle, deleteBatchTitle, addTimings, deleteTiming, addFees} = require("./controller");
const authenticate = require("../authenticate");

const router = express.Router();



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

// BATCHES
router.post("/addbatch", authenticate,  addBatch);

router.get("/fetchbatches",authenticate,  fetchBatches);
router.delete("/deleteBatch",authenticate,  deleteBatchTitle);
// done chaging till here

// Batch Timings
router.post('/addtimings', authenticate, addTimings);
router.post('/addfees', authenticate, addFees);
router.post('/deletetiming', authenticate, deleteTiming);

router.get("/fetchUserDetails", authenticate, fetchUserDetails);


module.exports = router;