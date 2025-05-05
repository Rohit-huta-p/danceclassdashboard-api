const router = require("express").Router();

const {getAllAttendance, updateAttendance, deleteAttendance, getAttendanceHistoryForStudent} = require("../contollers/AttendanceController");
const authenticate = require("../../authenticate");

router.get('/:date', authenticate, getAllAttendance)
router.get('/:id/studentHistory', getAttendanceHistoryForStudent)

router.put('/:date', authenticate, updateAttendance)
router.delete('/:id', authenticate, deleteAttendance)  

module.exports = router;