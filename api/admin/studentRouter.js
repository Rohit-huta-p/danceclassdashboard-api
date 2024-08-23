const express = require("express");
const { addstudent,getStudents, deletestudent, feeUpdate, downloadFeeHistory, upateAttendance, deleteAttendance, calCollectedAmount, studentPerMonth, 
    createPdf, fetchPdf,
    monthlyPendingFeesReportCreatePdf, monthlyPendingFeesReport_FetchPdf} = require("./StudentController");
const router = express.Router();
const multerUploads = require('../../config/multer');
const authenticate = require("../authenticate");
 


router.get('/students', authenticate, getStudents)

router.post('/addstudent' , authenticate, multerUploads.single('image'),addstudent)
router.delete('/deletestudent/:id', deletestudent)
router.put('/updatestudent/:id', multerUploads.none(),feeUpdate)
router.get('/downloadFeeHistory/:id',downloadFeeHistory)

router.get('/studentPerMonth/:id', studentPerMonth)

router.get('/collectedAmount', authenticate, calCollectedAmount)
router.post('/students/attendance', upateAttendance )
router.delete('/students/delete/:id', deleteAttendance )
router.post('/createpdf', createPdf )
router.get('/fetchPdf', fetchPdf )


router.post('/create-monthlyreport', monthlyPendingFeesReportCreatePdf )
router.get('/fetch-monthlyreport', monthlyPendingFeesReport_FetchPdf )





module.exports = router