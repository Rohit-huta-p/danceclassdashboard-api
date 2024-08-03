const express = require("express");
const { addstudent,getStudents, deletestudent, feeUpdate, downloadFeeHistory, upateAttendance, deleteAttendance} = require("./StudentController");
const router = express.Router();
const multerUploads = require('../../config/multer');
 


router.post('/addstudent', multerUploads.single('image'), addstudent)
router.get('/students', getStudents)
router.delete('/deletestudent/:id', deletestudent)
router.put('/updatestudent/:id', multerUploads.none(),feeUpdate)
router.get('/downloadFeeHistory/:id',downloadFeeHistory)

router.post('/students/attendance', upateAttendance )
router.delete('/students/delete/:id', deleteAttendance )

module.exports = router