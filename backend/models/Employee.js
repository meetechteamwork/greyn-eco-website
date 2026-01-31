const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee']
  },
  department: {
    type: String,
    required: true,
    enum: ['Executive', 'Sustainability', 'Human Resources', 'Finance']
  },
  xpPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'on-leave', 'inactive'],
    default: 'active'
  },
  corporateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
employeeSchema.index({ corporateId: 1, email: 1 });
employeeSchema.index({ corporateId: 1, status: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
