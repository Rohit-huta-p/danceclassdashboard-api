const StudentModel = require('./StudentModel');

const cron = require('node-cron');

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