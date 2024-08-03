const express = require('express')
const app = express();


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 8001

// RELEVANT PACKAGES
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'https://danceclassdashboard.vercel.app',
    credentials: true,
}));






// DATABASE
const mongoose = require('mongoose');
const authenticate  = require('./api/user/authenticate.js');
const MONGO_URI = process.env.MONGO_URI 

// ROUTES
const userRoute = require('./api/user/routes')
const studentRouter = require('./api/admin/studentRouter.js')

// Verify route

app.get('/verify', authenticate,(req, res) => {
    res.send('This is a protected route');
    }
);


app.use("/api/user", userRoute);

app.use("/api/admin", studentRouter)


const startServer  = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")
        
        app.listen(PORT, () => {
            console.log("Server Started at", PORT);
        });
    } catch (error) {
        console.log(error);
    }
    
}


startServer();

