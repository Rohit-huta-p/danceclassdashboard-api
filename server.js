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
app.use(cors(corsConfigLocal));







// DATABASE
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI 

// ROUTES
const userRoute = require('./api/user/routes')
const studentRouter = require('./api/admin/studentRouter.js');
const authenticate = require('./api/authenticate.js');

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

