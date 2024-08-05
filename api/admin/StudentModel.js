const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Reference the Student model
      required: true,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
    },
    // Optional fields (if needed)
    reason: {
      type: String,
    },
    remarks: {
      type: String,
    },
  });

const feeHistorySchema = new mongoose.Schema({
    status: String,
    date: Date
  });
  

const StudentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    name: {
        type: String,
        // required: true,
    },
    contact: {
        type: String,
    },
    age: {
        type: Number,
        // required: true,
    },
    dateOfJoining: {
        type: Date,
        // required: true,
    },
    batch: {
        type: String,
        // required: true,
    },
    Image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s'
    },
    feeStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    balance: {
        type: Number,
        default: 0,
    },
    feeHistory: [feeHistorySchema],
    attendance: [attendanceSchema],
    createAt: {
        type: Date,
        default: Date.now,
    }
});

StudentSchema.pre('save', function(next) {
    if (!this.studentId) {
        this.studentId = `STU-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

const StudentModel = mongoose.model('Student', StudentSchema);


module.exports = StudentModel;