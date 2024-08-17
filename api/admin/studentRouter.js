const express = require("express");
const { addstudent,getStudents, deletestudent, feeUpdate, downloadFeeHistory, upateAttendance, deleteAttendance, calCollectedAmount} = require("./StudentController");
const router = express.Router();
const multerUploads = require('../../config/multer');
const authenticate = require("../authenticate");
 



router.post('/addstudent' , authenticate, multerUploads.single('image'),addstudent)
router.get('/students', authenticate, getStudents)
router.get('/collectedAmount', authenticate, calCollectedAmount)
router.delete('/deletestudent/:id', deletestudent)
router.put('/updatestudent/:id', multerUploads.none(),feeUpdate)
router.get('/downloadFeeHistory/:id',downloadFeeHistory)

router.post('/students/attendance', upateAttendance )
router.delete('/students/delete/:id', deleteAttendance )

module.exports = router