'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

type EmployeeRole = 'Corporate Admin' | 'Sustainability Manager' | 'HR Manager' | 'Finance Manager' | 'Employee';

interface Employee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: string;
  xpPoints: number;
  avatar?: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<EmployeeRole | 'all'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [currentEmployeeRole, setCurrentEmployeeRole] = useState<EmployeeRole>('Corporate Admin');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'Employee' as EmployeeRole,
    department: 'Sustainability',
    xpPoints: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'on-leave' | 'inactive'
  });

  useEffect(() => {
    const storedRole = localStorage.getItem('employeeRole') as EmployeeRole;
    if (storedRole && ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee'].includes(storedRole)) {
      setCurrentEmployeeRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.corporate.employees.getAll();
        if (response.success && response.data) {
          const employeesData = response.data as any;
          setEmployees(Array.isArray(employeesData) ? employeesData : []);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleRoleChange = (role: EmployeeRole) => {
    setCurrentEmployeeRole(role);
    localStorage.setItem('employeeRole', role);
    window.location.reload();
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.corporate.employees.create({
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        department: newEmployee.department,
        xpPoints: newEmployee.xpPoints,
        joinDate: newEmployee.joinDate,
        status: newEmployee.status
      });

      if (response.success && response.data) {
        const newEmployeeData = response.data as any;
        setEmployees([...employees, newEmployeeData]);
        setShowAddModal(false);
        setNewEmployee({
          name: '',
          email: '',
          role: 'Employee',
          department: 'Sustainability',
          xpPoints: 0,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active'
        });
        alert('Employee added successfully!');
      } else {
        alert(response.message || 'Failed to add employee');
      }
    } catch (error: any) {
      console.error('Error adding employee:', error);
      alert(error.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.corporate.employees.delete(id);

      if (response.success) {
        setEmployees(employees.filter(emp => (emp._id || emp.id) !== id));
        alert('Employee removed successfully!');
      } else {
        alert(response.message || 'Failed to remove employee');
      }
    } catch (error: any) {
      console.error('Error removing employee:', error);
      alert(error.message || 'Failed to remove employee');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Executive', 'Sustainability', 'Human Resources', 'Finance'];
  const roles: EmployeeRole[] = ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee'];

  const getRoleBadge = (role: EmployeeRole) => {
    const styles = {
      'Corporate Admin': 'bg-purple-100 text-purple-700 border-purple-300',
      'Sustainability Manager': 'bg-green-100 text-green-700 border-green-300',
      'HR Manager': 'bg-blue-100 text-blue-700 border-blue-300',
      'Finance Manager': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Employee': 'bg-gray-100 text-gray-700 border-gray-300'
    };

    const icons = {
      'Corporate Admin': '👑',
      'Sustainability Manager': '🌱',
      'HR Manager': '👥',
      'Finance Manager': '💰',
      'Employee': '👤'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[role]}`}>
        <span>{icons[role]}</span>
        <span>{role}</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-300',
      'on-leave': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      inactive: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status === 'active' ? '●' : status === 'on-leave' ? '○' : '○'} {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalXPPoints = employees.reduce((sum, emp) => sum + emp.xpPoints, 0);
  const avgXPPoints = totalEmployees > 0 ? Math.round(totalXPPoints / totalEmployees) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text break-words">
            Employee Management
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Manage your team, track performance, and monitor XP points
          </p>
        </div>

        {/* Role Switcher */}
        <div className="w-full lg:w-auto bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Your Role:</span>
            <select
              value={currentEmployeeRole}
              onChange={(e) => handleRoleChange(e.target.value as EmployeeRole)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all bg-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <option value="Corporate Admin">Corporate Admin</option>
              <option value="Sustainability Manager">Sustainability Manager</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-2">Change role to see sidebar access changes</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl">👥</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm opacity-90">Total Employees</div>
              <div className="text-2xl sm:text-3xl font-bold">{totalEmployees}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl">✓</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm opacity-90">Active</div>
              <div className="text-2xl sm:text-3xl font-bold">{activeEmployees}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl">⭐</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm opacity-90">Total XP Points</div>
              <div className="text-2xl sm:text-3xl font-bold">{totalXPPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl">📊</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm opacity-90">Avg XP Points</div>
              <div className="text-2xl sm:text-3xl font-bold">{avgXPPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 md:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as EmployeeRole | 'all')}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Filter by Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Employees</h2>
              <p className="text-sm sm:text-base text-gray-600">Showing {filteredEmployees.length} of {totalEmployees} employees</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="p-8 sm:p-12 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Employees Found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {searchQuery || filterRole !== 'all' || filterDepartment !== 'all'
                  ? 'Try adjusting your search or filters to find employees.'
                  : 'Get started by adding your first employee to the system.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Add Your First Employee</span>
              </button>
            </div>
          </div>
        )}

        {/* Table - Only show if there are employees */}
        {filteredEmployees.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      XP Points
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id || employee.id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${getAvatarColor(employee.name)} flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg flex-shrink-0`}>
                            {getInitials(employee.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{employee.name}</div>
                            <div className="text-xs text-gray-500 truncate">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {getRoleBadge(employee.role)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{employee.department}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                            ⭐ {employee.xpPoints.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {getStatusBadge(employee.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee._id || employee.id || '')}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> of <span className="font-semibold text-gray-900">{totalEmployees}</span> employees
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                  Previous
                </button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-xs sm:text-sm font-semibold text-white">
                  1
                </button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as EmployeeRole })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Corporate Admin">Corporate Admin</option>
                    <option value="Sustainability Manager">Sustainability Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Initial XP Points</label>
                  <input
                    type="number"
                    value={newEmployee.xpPoints}
                    onChange={(e) => setNewEmployee({ ...newEmployee, xpPoints: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as 'active' | 'on-leave' | 'inactive' })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(selectedEmployee.name)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  {getInitials(selectedEmployee.name)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Role</label>
                  <div className="mt-2">
                    {getRoleBadge(selectedEmployee.role)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Department</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedEmployee.department}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">XP Points</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                      ⭐ {selectedEmployee.xpPoints.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Status</label>
                  <div className="mt-2">
                    {getStatusBadge(selectedEmployee.status)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Join Date</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedEmployee.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Employee ID</label>
                  <p className="text-lg font-semibold text-gray-900 font-mono">{selectedEmployee._id || selectedEmployee.id}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

