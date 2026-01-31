const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { authenticate } = require('../middleware/auth');

// Middleware to check if user is corporate
const isCorporate = (req, res, next) => {
  if (req.user.role !== 'corporate') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Corporate users only.'
    });
  }
  next();
};

// Get all employees for the logged-in corporate
router.get('/', authenticate, isCorporate, async (req, res) => {
  try {
    const employees = await Employee.find({ corporateId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
});

// Get a specific employee
router.get('/:id', authenticate, isCorporate, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      corporateId: req.user.userId
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
});

// Add a new employee
router.post('/', authenticate, isCorporate, async (req, res) => {
  try {
    const { name, email, role, department, xpPoints, joinDate, status } = req.body;

    // Validate required fields
    if (!name || !email || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, role, and department are required'
      });
    }

    // Check if employee with same email already exists for this corporate
    const existingEmployee = await Employee.findOne({
      corporateId: req.user.userId,
      email: email.toLowerCase().trim()
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email already exists'
      });
    }

    // Create new employee
    const employee = await Employee.create({
      name,
      email: email.toLowerCase().trim(),
      role,
      department,
      xpPoints: xpPoints || 0,
      joinDate: joinDate || new Date(),
      status: status || 'active',
      corporateId: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee
    });
  } catch (error) {
    console.error('Add Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding employee',
      error: error.message
    });
  }
});

// Update an employee
router.put('/:id', authenticate, isCorporate, async (req, res) => {
  try {
    const { name, email, role, department, xpPoints, joinDate, status } = req.body;

    // Find employee
    const employee = await Employee.findOne({
      _id: req.params.id,
      corporateId: req.user.userId
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase().trim() !== employee.email) {
      const existingEmployee = await Employee.findOne({
        corporateId: req.user.userId,
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });

      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email already exists'
        });
      }
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email.toLowerCase().trim();
    if (role) employee.role = role;
    if (department) employee.department = department;
    if (xpPoints !== undefined) employee.xpPoints = xpPoints;
    if (joinDate) employee.joinDate = joinDate;
    if (status) employee.status = status;

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Update Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
});

// Delete an employee
router.delete('/:id', authenticate, isCorporate, async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      corporateId: req.user.userId
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee removed successfully'
    });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing employee',
      error: error.message
    });
  }
});

// Get employee statistics
router.get('/stats/summary', authenticate, isCorporate, async (req, res) => {
  try {
    const employees = await Employee.find({ corporateId: req.user.userId });

    const stats = {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      onLeave: employees.filter(e => e.status === 'on-leave').length,
      inactive: employees.filter(e => e.status === 'inactive').length,
      totalXP: employees.reduce((sum, e) => sum + e.xpPoints, 0),
      averageXP: employees.length > 0
        ? Math.round(employees.reduce((sum, e) => sum + e.xpPoints, 0) / employees.length)
        : 0,
      byDepartment: {
        Executive: employees.filter(e => e.department === 'Executive').length,
        Sustainability: employees.filter(e => e.department === 'Sustainability').length,
        'Human Resources': employees.filter(e => e.department === 'Human Resources').length,
        Finance: employees.filter(e => e.department === 'Finance').length
      },
      byRole: {
        'Corporate Admin': employees.filter(e => e.role === 'Corporate Admin').length,
        'Sustainability Manager': employees.filter(e => e.role === 'Sustainability Manager').length,
        'HR Manager': employees.filter(e => e.role === 'HR Manager').length,
        'Finance Manager': employees.filter(e => e.role === 'Finance Manager').length,
        'Employee': employees.filter(e => e.role === 'Employee').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Employee Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee statistics',
      error: error.message
    });
  }
});

module.exports = router;
