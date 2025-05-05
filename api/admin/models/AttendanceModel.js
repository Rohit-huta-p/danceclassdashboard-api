const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  present: {
    type: Boolean,
    required: true
  }
});

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true // one document per date
  },
  records: [studentAttendanceSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
