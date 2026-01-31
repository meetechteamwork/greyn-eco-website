const { SimpleUser, NGO, Corporate, CarbonUser, Admin } = require('../models/User');

/**
 * Maps role to portal access
 */
const getPortalAccess = (role) => {
  const portalMap = {
    'simple-user': [],
    'ngo': ['NGO Portal'],
    'corporate': ['Corporate ESG'],
    'carbon': ['Carbon Marketplace'],
    'admin': ['Admin Portal']
  };
  return portalMap[role] || [];
};

/**
 * Formats last active time
 */
const formatLastActive = (lastLogin) => {
  if (!lastLogin) return 'Never';
  
  const now = new Date();
  const diffMs = now - new Date(lastLogin);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(lastLogin).toLocaleDateString();
};

/**
 * Normalizes user data from different models to unified format
 */
const normalizeUser = (user, modelType) => {
  let name, email, role, status, createdAt, lastLogin;

  switch (modelType) {
    case 'SimpleUser':
      name = user.name;
      email = user.email;
      role = user.role;
      status = user.status === 'inactive' ? 'suspended' : user.status;
      createdAt = user.createdAt || user.created_at;
      lastLogin = user.lastLogin;
      break;
    case 'NGO':
      name = user.contactPerson || user.organizationName;
      email = user.email;
      role = user.role;
      status = user.status === 'inactive' ? 'suspended' : user.status;
      createdAt = user.createdAt || user.created_at;
      lastLogin = user.lastLogin;
      break;
    case 'Corporate':
      name = user.contactPerson || user.companyName;
      email = user.email;
      role = user.role;
      status = user.status === 'inactive' ? 'suspended' : user.status;
      createdAt = user.createdAt || user.created_at;
      lastLogin = user.lastLogin;
      break;
    case 'CarbonUser':
      name = user.name;
      email = user.email;
      role = user.role;
      status = user.status === 'inactive' ? 'suspended' : user.status;
      createdAt = user.createdAt || user.created_at;
      lastLogin = user.lastLogin;
      break;
    case 'Admin':
      name = user.name;
      email = user.email;
      role = user.role;
      status = user.status === 'inactive' ? 'suspended' : user.status;
      createdAt = user.createdAt || user.created_at;
      lastLogin = user.lastLogin;
      break;
    default:
      return null;
  }

  // Portal access is only granted if user is active
  // Suspended or pending users don't have portal access
  // Use the actual status from the user object, not the normalized status
  const actualStatus = user.status === 'inactive' ? 'suspended' : user.status;
  const portalAccess = (actualStatus === 'active') ? getPortalAccess(role) : [];

  return {
    id: user._id.toString(),
    name,
    email,
    role,
    portalAccess,
    status: actualStatus,
    joinDate: createdAt ? new Date(createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    lastActive: formatLastActive(lastLogin),
    avatar: undefined
  };
};

/**
 * Get all users from all collections
 */
const getAllUsers = async (filters = {}) => {
  try {
    const { search, status, role, portal } = filters;

    // Build query conditions for each model
    const buildQuery = (baseQuery = {}) => {
      const query = { ...baseQuery };
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { contactPerson: { $regex: search, $options: 'i' } },
          { organizationName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ];
      }

      if (status && status !== 'all') {
        if (status === 'suspended') {
          query.$or = query.$or || [];
          query.$or.push({ status: 'suspended' }, { status: 'inactive' });
        } else {
          query.status = status;
        }
      }

      return query;
    };

    // Fetch from all collections in parallel
    const [simpleUsers, ngos, corporates, carbonUsers, admins] = await Promise.all([
      role && role !== 'all' && role !== 'simple-user' 
        ? [] 
        : SimpleUser.find(buildQuery({ role: 'simple-user' })).lean(),
      role && role !== 'all' && role !== 'ngo' 
        ? [] 
        : NGO.find(buildQuery({ role: 'ngo' })).lean(),
      role && role !== 'all' && role !== 'corporate' 
        ? [] 
        : Corporate.find(buildQuery({ role: 'corporate' })).lean(),
      role && role !== 'all' && role !== 'carbon' 
        ? [] 
        : CarbonUser.find(buildQuery({ role: 'carbon' })).lean(),
      role && role !== 'all' && role !== 'admin' 
        ? [] 
        : Admin.find(buildQuery({ role: 'admin' })).lean()
    ]);

    // Normalize all users
    let allUsers = [
      ...simpleUsers.map(u => normalizeUser(u, 'SimpleUser')),
      ...ngos.map(u => normalizeUser(u, 'NGO')),
      ...corporates.map(u => normalizeUser(u, 'Corporate')),
      ...carbonUsers.map(u => normalizeUser(u, 'CarbonUser')),
      ...admins.map(u => normalizeUser(u, 'Admin'))
    ].filter(Boolean);

    // Filter by portal access if specified
    if (portal && portal !== 'all') {
      allUsers = allUsers.filter(user => 
        user.portalAccess.includes(portal)
      );
    }

    // Filter by role if specified
    if (role && role !== 'all') {
      allUsers = allUsers.filter(user => user.role === role);
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      allUsers = allUsers.filter(user => {
        if (status === 'suspended') {
          return user.status === 'suspended' || user.status === 'inactive';
        }
        return user.status === status;
      });
    }

    return allUsers;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Get user statistics
 */
const getUserStats = async () => {
  try {
    const [simpleUsers, ngos, corporates, carbonUsers, admins] = await Promise.all([
      SimpleUser.find().lean(),
      NGO.find().lean(),
      Corporate.find().lean(),
      CarbonUser.find().lean(),
      Admin.find().lean()
    ]);

    const allUsers = [
      ...simpleUsers.map(u => normalizeUser(u, 'SimpleUser')),
      ...ngos.map(u => normalizeUser(u, 'NGO')),
      ...corporates.map(u => normalizeUser(u, 'Corporate')),
      ...carbonUsers.map(u => normalizeUser(u, 'CarbonUser')),
      ...admins.map(u => normalizeUser(u, 'Admin'))
    ].filter(Boolean);

    return {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === 'active').length,
      pending: allUsers.filter(u => u.status === 'pending').length,
      suspended: allUsers.filter(u => u.status === 'suspended' || u.status === 'inactive').length
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  try {
    // Try each collection
    let user = await SimpleUser.findById(userId).lean();
    if (user) return normalizeUser(user, 'SimpleUser');

    user = await NGO.findById(userId).lean();
    if (user) return normalizeUser(user, 'NGO');

    user = await Corporate.findById(userId).lean();
    if (user) return normalizeUser(user, 'Corporate');

    user = await CarbonUser.findById(userId).lean();
    if (user) return normalizeUser(user, 'CarbonUser');

    user = await Admin.findById(userId).lean();
    if (user) return normalizeUser(user, 'Admin');

    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Get model by role
 */
const getModelByRole = (role) => {
  const modelMap = {
    'simple-user': SimpleUser,
    'ngo': NGO,
    'corporate': Corporate,
    'carbon': CarbonUser,
    'admin': Admin
  };
  return modelMap[role];
};

/**
 * Update user status
 */
const updateUserStatus = async (userId, newStatus) => {
  try {
    // Normalize status: ensure 'active' is set correctly, 'suspended' maps correctly
    let normalizedStatus = newStatus;
    if (newStatus === 'active') {
      normalizedStatus = 'active';
    } else if (newStatus === 'suspended') {
      normalizedStatus = 'suspended';
    }

    // Find user in any collection
    let user = await SimpleUser.findById(userId);
    if (user) {
      user.status = normalizedStatus;
      await user.save();
      // Reload user to get fresh data
      const updatedUser = await SimpleUser.findById(userId).lean();
      return normalizeUser(updatedUser, 'SimpleUser');
    }

    user = await NGO.findById(userId);
    if (user) {
      user.status = normalizedStatus;
      await user.save();
      const updatedUser = await NGO.findById(userId).lean();
      return normalizeUser(updatedUser, 'NGO');
    }

    user = await Corporate.findById(userId);
    if (user) {
      user.status = normalizedStatus;
      await user.save();
      const updatedUser = await Corporate.findById(userId).lean();
      return normalizeUser(updatedUser, 'Corporate');
    }

    user = await CarbonUser.findById(userId);
    if (user) {
      user.status = normalizedStatus;
      await user.save();
      const updatedUser = await CarbonUser.findById(userId).lean();
      return normalizeUser(updatedUser, 'CarbonUser');
    }

    user = await Admin.findById(userId);
    if (user) {
      user.status = normalizedStatus;
      await user.save();
      const updatedUser = await Admin.findById(userId).lean();
      return normalizeUser(updatedUser, 'Admin');
    }

    return null;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Update user role
 */
const updateUserRole = async (userId, newRole) => {
  try {
    // This is a complex operation - we need to:
    // 1. Find the user in their current collection
    // 2. Create them in the new collection
    // 3. Delete from old collection
    
    // First, find the user
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const oldModel = getModelByRole(user.role);
    const newModel = getModelByRole(newRole);

    if (!oldModel || !newModel) {
      throw new Error('Invalid role');
    }

    // Get the original user document
    const originalUser = await oldModel.findById(userId);
    if (!originalUser) {
      throw new Error('User not found in original collection');
    }

    // Prepare data for new model
    const userData = originalUser.toObject();
    delete userData._id;
    delete userData.__v;
    delete userData.createdAt;
    delete userData.updatedAt;

    // Create in new collection
    const newUser = await newModel.create({
      ...userData,
      role: newRole
    });

    // Delete from old collection
    await oldModel.findByIdAndDelete(userId);

    // Determine model type name for normalization based on role
    const roleToModelType = {
      'simple-user': 'SimpleUser',
      'ngo': 'NGO',
      'corporate': 'Corporate',
      'carbon': 'CarbonUser',
      'admin': 'Admin'
    };
    const modelType = roleToModelType[newRole] || 'SimpleUser';
    
    return normalizeUser(newUser.toObject(), modelType);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  updateUserRole,
  normalizeUser
};
