const { generateFeeHistoryPdf } = require('./pdfGenerator');
const StudentModel = require('./StudentModel');

const cron = require('node-cron');
const moment = require('moment-timezone');
const User = require('../user/model');
const path = require('path');
const pdf = require('html-pdf')
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
        const { name, age, dateOfJoining, batch, contact, fees, feesPaid } = req.body;
        const parsedFeesPaid = parseFloat(feesPaid);
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
            fees,
            feesPaid,
            feeHistory: [{ status: 'pending', date: new Date() }],
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

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    
    const { feesPaid, ...updateData } = req.body;

    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Update general fields (excluding 'feesPaid')
    for (const key in updateData) {
      if (updateData[key] !== undefined && key !== 'feesPaid') {
        student[key] = updateData[key];
      }
    }

    // Convert to number and validate
    console.log(typeof feesPaid);
    
    const parsedFeesPaid = Number(feesPaid);

    console.log(feesPaid);
    
    if (parsedFeesPaid) {
      console.log("TYPE student.feesPaid" + typeof student.feesPaid);
      console.log("TYPE parsedFeesPaid" +typeof parsedFeesPaid);
      
      student.feesPaid = Number(student.feesPaid) + parsedFeesPaid;

      if (student.feesPaid >= student.fees) {
        student.feesPaid = student.fees;
        student.feeHistory.push({ status: 'paid', currPaid: parsedFeesPaid,date: new Date() });

        await student.save();
        return res.status(200).json({
          success: true,
          message: 'Student FULLY PAID',
          data: student
        });
      } else {
        student.feeHistory.push({
          status: 'pending',
          date: new Date(),
          currPaid: parsedFeesPaid,
          balance: student.fees - student.feesPaid
        });

        await student.save();
        return res.status(200).json({
          success: true,
          message: `Student fees pending - ${student.fees - student.feesPaid}`,
          data: student
        });
      }
    }

    // Save without fee changes
    await student.save();
    return res.status(200).json({ success: true, data: student });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error updating fee status',
      error: error.message
    });
  }
};

  


  

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





const calCollectedAmount = async (req, res) => {
    const { userId } = req.user;
    const students = await StudentModel.find({ createdBy: userId });
   
    let totalAmount = 0;
    let totalFees = 0;
    students.forEach((student) => {
        totalAmount = totalAmount + student.feesPaid;
        totalFees = totalFees + student.fees;
        
    })
    return res.status(200).json({totalAmount, totalFees});
  

} 


const studentPerMonth =  async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findOne({_id: id});
    if(user){
        return res.status(200).json({studentsPerMonth: user.studentsPerMonth})
    }
    
}

const pdfTemplate =require('./pdfTemplate');
const pdfTemplateMonthly =require('./pdfTemplate');
const createPdf = (req, res) => {
    const {name, amount} = req.body
    const outputPath = path.resolve(__dirname, '../../../frontend/src/assets/', `${name}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`);
   
    pdf.create(pdfTemplate(req.body), {}).toFile(outputPath, (err) => {
        if(err) {
            return console.log('error');
        }
    res.send(Promise.resolve())
      });
}

const fetchPdf = (req, res) => {
    const { name, amount } = req.query; // Use req.query to access GET query parameters

    console.log(name);
    
    const outputPath = path.resolve(__dirname, '../../../frontend/src/assets/', `${name}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`);
   
    
    res.sendFile(outputPath);
  };

const pt_MonthlyReport = require('./pt_MonthlyReport');
const { log } = require('console');
const monthlyPendingFeesReportCreatePdf = (req, res) => {
    const {students} = req.body

    const outputPath = path.resolve(__dirname, '../../../frontend/src/assets/', `${new Date().getMonth()}_${new Date().getFullYear()}_Fee_Report.pdf`);
   
    pdf.create(pt_MonthlyReport(req.body), {}).toFile(outputPath, (err) => {
        if(err) {
            return console.log('error');
        }
            res.send(Promise.resolve())
      });
}
const monthlyPendingFeesReport_FetchPdf = (req, res) => {
    const outputPath = path.resolve(__dirname, '../../../frontend/src/assets/', `${new Date().getMonth()}_${new Date().getFullYear()}_Fee_Report.pdf`);
    res.sendFile(outputPath);
  };

module.exports = {
    addstudent, deletestudent, getStudents, 
    updateStudent, 
    
    downloadFeeHistory, calCollectedAmount, studentPerMonth, 
    createPdf, fetchPdf,
    monthlyPendingFeesReportCreatePdf, monthlyPendingFeesReport_FetchPdf
};