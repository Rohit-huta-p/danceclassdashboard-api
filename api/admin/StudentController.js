const { generateFeeHistoryPdf } = require('./pdfGenerator');
const StudentModel = require('./StudentModel');
const cron = require('node-cron');
const moment = require('moment-timezone');
const User = require('../user/model');

// Schedule
cron.schedule('0 0 1 * *', async() => {
    try {
        const students = await StudentModel.find();
        students.forEach(async (student) => {
            student.feeHistory.push({status: student.feeStatus, date: new Date()});
            student.feeStatus = 'pending';
            await student.save();
            console.log('Fee status reset and history updated for all students');
        })
    } catch (error) {
        console.error('Error resetting fee status:', error);

    }
})

// cron.schedule('0 0 * * *', async() => {
//     try {
//         const students = await StudentModel.find();
//         students.forEach(async (student) => {
//             student.attendance.map(entry => {
//                 entry.disabled = false;
//             })
//             await student.save();
//             console.log('Fee status reset and history updated for all students');
//         })
//     } catch (error) {
//         console.error('Error resetting fee status:', error);

//     }
// })

// ADD STUDENT
const addstudent = async (req, res) => {
    
    try {
      
        
        const { name, age, dateOfJoining, batch, feeStatus, balance, contact } = req.body;
        console.log(typeof balance);
        
        let imageUrl;
       
        if(req.file){
            imageUrl = req.file.path;
        }else{
            imageUrl = "https://res.cloudinary.com/dempyh9cj/image/upload/v1721107625/image_vikjmz.png";
        }


    
        const newStudent = new StudentModel({
            name,
            age,
            contact,
            dateOfJoining,
            batch,
            Image: imageUrl,
            feeStatus,
            balance,
            feeHistory: [{ status: feeStatus, date: new Date() }],
            createdBy: req.user.userId,
        });
      
       
        await newStudent.save();
        return res.status(200).json({student: newStudent, message: "Student Saved"});
    } catch (error) {
        return res.status(500).json({error: error,message: "Internal Server Error"});
    }
    
}
const getStudents = async (req, res) => {
    const { userId } = req.user;
  
    try {
      const students = await StudentModel.find({ createdBy: userId });
  
      if (students.length > 0) {
        return res.status(200).json({ students });
      } else {
        return res.status(200).json({ message: "No students found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error, message: "Internal Server Error" });
    }
  };
// Delete Students
const deletestudent = async (req, res) => {

    try {
        const student = await StudentModel.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

// Fee Update
const feeUpdate = async (req, res) => {
    try {
        const id = req.params.id;

        const {feeStatus, balance, addSubtractBalance} = req.body;
        const student = await StudentModel.findById(id);
        console.log(req.body);


        if(student){
            if(feeStatus != ''){
                student.feeHistory.push({status: feeStatus, date: new Date()});
                student.feeStatus = feeStatus;
            }else if(balance  ){
                console.log("Addition",balance + student.balance,typeof (balance + student.balance));
                console.log("SUBTRACTION",balance - student.balance,typeof (balance - student.balance));
                
                student.balance = addSubtractBalance === 'add' ? 
                                        Number(student.balance) + Number(balance) : student.balance - balance;
                student.balance = student.balance <= 0 ? 0 : student.balance;
            }

            await student.save();
            console.log(student.balance);
            
            return res.status(200).json({message: "Fee Updated", data: student});
        }else {
            res.status(404).json({ message: 'Student not found' });
          }
    } catch (error) {
        res.status(500).json({ message: 'Error updating fee status', error: error.message });
    }
}

// getFeeHistory
const downloadFeeHistory = async (req, res) => {
    try {
        const id = req.params.id;

        const student = await StudentModel.findById(id);
        if (student) {
        // PDF FILE
            // const filePath = await generateFeeHistoryPdf(student);
            // console.log(`PDF generated at: ${filePath}`);
            // res.setHeader('Content-Disposition', `attachment; filename=${student.name}_fee_history.pdf`);
            // res.download(filePath);
            return res.status(200).json({ feeHistory: student.feeHistory });
        } else {
            return res.status(400).json({ message: "Student Not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};


const upateAttendance = async (req, res) => {
    const attendanceData  = req.body;

    try {
        
        for(const everyObject of attendanceData){
            let {id, attendance, date} = everyObject;

            // converting to IST
            date = moment(date).tz('Asia/Kolkata').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)');
            const formatDate = (date) => { return moment(date).tz('Asia/Kolkata').format('DD/MM/YYYY');}
            if(!id || !attendance){
                return res.status(400).json({ message: "Missing required fields (id, attendance)" });
            }else{
                const student = await StudentModel.findById(id);
    
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
          
               // Find the index of the existing attendance record for the same date
                const index = student.attendance.findIndex(att => {
                    console.log(formatDate(att.date));
                    
                    const attendanceDate = formatDate(att.date);
                    console.log(date);
                    
                    const entryDate = formatDate(date);
                    return attendanceDate === entryDate;
                });
                console.log(index);
                
                if (index !== -1) {
                    // Update the existing attendance record
                    student.attendance[index].status = attendance;
                    student.attendance[index].disabled = true;
                } else {
                    // Create a new attendance record
                    console.log(date);
                    student.attendance.push({
                    student: student._id,
                    date: date,
                    status: attendance
                    });
                }
                await student.save();
    
                }
                return res.status(200).json({ message: "Attendance data updated successfully"});
        }
            

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating attendance data" });
    } 
   
}

const deleteAttendance = async (req, res) => {
    const {id} = req.params;

    const student = await StudentModel.findById(id);
    if(student){
        student.attendance = [];
        await student.save();
        return res.status(200).json({ message: 'All attendance records deleted successfully' });
    }
}


module.exports = {addstudent, deletestudent, getStudents, feeUpdate, downloadFeeHistory, upateAttendance, deleteAttendance};