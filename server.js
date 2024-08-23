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
// app.use(cors(corsConfigProduction));
app.use(cors(corsConfigProduction));







// DATABASE
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI 

// ROUTES
const userRoute = require('./api/user/routes')
const studentRouter = require('./api/admin/studentRouter.js');

const cron = require('node-cron');
const StudentModel = require('./api/admin/StudentModel.js'); // Adjust the path accordingly
const User = require('./api/user/model.js'); // Adjust the path accordingly
const authenticate = require('./api/authenticate.js');




app.use("/api/user", userRoute);

app.use("/api/admin" ,authenticate, studentRouter)

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
   
    });
   
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

