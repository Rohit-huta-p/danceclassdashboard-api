const express = require('express')
const app = express();
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






// DATABASE
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI 

// ROUTES
const userRoute = require('./api/user/routes')
const studentRouter = require('./api/admin/studentRouter.js');
const authenticate = require('./api/authenticate.js');



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

