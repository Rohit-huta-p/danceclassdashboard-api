const AttendanceModel = require("../models/AttendanceModel");
const getAllAttendance = async (req, res) => {
    let {date} = req.params;
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);



    nextDate.setDate(targetDate.getDate() + 1);
    


    
    const attendance = await AttendanceModel.findOne({
      date: {
        $gte: targetDate,
        $lt: nextDate
      }
    });
    console.log(attendance);
    
    if(!attendance){
        return res.status(404).json({ message: 'No attendance records found' });
    }
    return res.status(200).json({ records: attendance.records });

}

// GET /api/student/:id/attendance-history
const getAttendanceHistoryForStudent = async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const attendanceRecords = await AttendanceModel.find({
        'records.student': studentId
      }).select('date records');
  
      // Extract only that student's record for each date
      const studentAttendance = attendanceRecords.map(entry => {
        const studentRecord = entry.records.find(r => r.student.toString() === studentId);
        return {
          date: entry.date,
          present: studentRecord?.present ?? false
        };
      });
      console.log(studentAttendance);
      
      return res.status(200).json({ studentAttendance });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch attendance history." });
    }
  };
  

const updateAttendance = async (req, res) => {

    const updateAttendanceData = req.body;
    console.log(updateAttendanceData);
    
    try {
        const targetDate = new Date(req.params.date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(targetDate.getDate() + 1);
        
        const attendance = await AttendanceModel.findOne({
          date: {
            $gte: targetDate,
            $lt: nextDate
          }
        });

        
        
        if(!attendance){
            await AttendanceModel.create({date: req.params.date, records: updateAttendanceData});
            return res.status(200).json({ message: 'Attendance updated successfully' });
        }
        const records = attendance.records;
        console.log("RECORDS:  ",records);
        

        for (const {student, present} of updateAttendanceData) {
            console.log("IIIDDDD",student);
            
            records.map(record => console.log("RECORRDD: ", record.student.toString()));
            
            
            const recordPresent = records.find(record => record.student.toString() === student);
            console.log(recordPresent);
            
            if(!recordPresent){
                records.push({student: student, present});
            }else{
                recordPresent.present = present;
            }
        }
        await attendance.save();
        return res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating attendance data" });
    }
  };
  
  const deleteAttendance = async (req, res) => {
      const {id} = req.params;
  
      const student = await StudentModel.findById(id);
      if(student){
          student.attendance = [];
          await student.save();
          return res.status(200).json({ message: 'All attendance records deleted successfully' });
      }
  }



  module.exports = {
    getAllAttendance, updateAttendance, deleteAttendance, getAttendanceHistoryForStudent
  }