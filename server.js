const express = require('express')
const app = express();
const axios = require('axios')
const {corsConfigLocal, corsConfigProduction} = require('./api/user/Config.js')

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 8001

// RELEVANT PACKAGES
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsConfigProduction));
// app.use(cors(corsConfigLocal));







// DATABASE
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI 

// ROUTES
const userRoute = require('./api/user/routes')
const studentRouter = require('./api/admin/studentRouter.js');

const cron = require('node-cron');
const StudentModel = require('./api/admin/StudentModel.js'); // Adjust the path accordingly
const User = require('./api/user/model.js'); // Adjust the path accordingly



app.post('/send-sms', async (req, res) => {
    const { phone, message } = req.body;
    console.log(req.body);
    
    const apiKey = 'XM25s31kgIBnRQjFZEHzDJhyoWwaSclT876YNVOvqf4dtubeAi1J2i50erkFVogBGQbC6pZYvfnK7WE4';
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&sender_id=TXTIND&message=${encodeURIComponent(message)}&route=v3&numbers=${phone}`;

    try {
        const response = await axios.get(url);
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.log(error);
    }
});



app.use("/api/user", userRoute);

app.use("/api/admin" ,studentRouter)

const scheduleMonthlyTasks = () => {
    cron.schedule('0 0 1 * *', async () => {
        console.log("This task runs at midnight on the 1st of every month.");
        try {
            const allUsers = await StudentModel.find({}, 'createdBy');
            
            await Promise.all(allUsers.map(async user => {
                const students = await StudentModel.find({ createdBy: user.createdBy });
                const count = students.length;
                
                const currentDate = new Date();
                const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                const existingUser = await User.findOne({ _id: user.createdBy, "studentsPerMonth.month": previousMonth });
                if (existingUser) {
                    await User.findOneAndUpdate(
                        { _id: user.createdBy, "studentsPerMonth.month": previousMonth },
                        { $set: { "studentsPerMonth.$.studentCount": count } }
                    );
                    console.log("UPDATED", user);
                } else {
                    await User.findOneAndUpdate(
                        { _id: user.createdBy },
                        { $push: { studentsPerMonth: { month: previousMonth, studentCount: count } } }
                    );
                    console.log("UPDATED", user);
                }
            }));

            const students = await StudentModel.find();
            await Promise.all(students.map(async (student) => {
                student.feeHistory.push({ status: 'pending', date: new Date() });
                student.feesPaid = 0;
                await student.save();
                console.log('Fee status reset and history updated for student:', student.name);
            }));

        } catch (error) {
            console.error('Error resetting fee status or updating students per month:', error);
        }
    // Place your task logic here
    });
    // cron.schedule('0 0 1 * *', async () => {
    //     try {
    //         const allUsers = await StudentModel.find({}, 'createdBy');
            
    //         await Promise.all(allUsers.map(async user => {
    //             const students = await StudentModel.find({ createdBy: user.createdBy });
    //             const count = students.length;
                
    //             const currentDate = new Date();
    //             const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    //             const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    //             const existingUser = await User.findOne({ _id: user.createdBy, "studentsPerMonth.month": previousMonth });
    //             if (existingUser) {
    //                 await User.findOneAndUpdate(
    //                     { _id: user.createdBy, "studentsPerMonth.month": previousMonth },
    //                     { $set: { "studentsPerMonth.$.studentCount": count } }
    //                 );
    //                 console.log("UPDATED", user);
    //             } else {
    //                 await User.findOneAndUpdate(
    //                     { _id: user.createdBy },
    //                     { $push: { studentsPerMonth: { month: previousMonth, studentCount: count } } }
    //                 );
    //                 console.log("UPDATED", user);
    //             }
    //         }));

    //         const students = await StudentModel.find();
    //         await Promise.all(students.map(async (student) => {
    //             student.feeHistory.push({ status: 'pending', date: new Date() });
    //             student.feesPaid = 0;
    //             await student.save();
    //             console.log('Fee status reset and history updated for student:', student.name);
    //         }));

    //     } catch (error) {
    //         console.error('Error resetting fee status or updating students per month:', error);
    //     }
    // });
};


const startServer  = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")
         // Schedule the monthly tasks
         scheduleMonthlyTasks();
        app.listen(PORT, () => {
            console.log("Server Started at", PORT);
        });
    } catch (error) {
        console.log(error);
    }
    
}


startServer();

