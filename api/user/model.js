const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
   
    studioName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    batches:  [
        {
            batchTitle: String,
            timings: String,
            fees: Number,
        }
    ],

    studentsPerMonth: [
        {
            month: {
                type: String, // e.g., 'January', 'February'
                required: true
            },
            studentCount: {
                type: Number,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = User;
