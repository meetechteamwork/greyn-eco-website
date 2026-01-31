/**
 * Utility script to reset a corporate user's password
 * Usage: node backend/scripts/resetCorporatePassword.js <email> <newPassword>
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Corporate } = require('../models/User');

async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get email and new password from command line arguments
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.error('Usage: node resetCorporatePassword.js <email> <newPassword>');
      process.exit(1);
    }

    // Find the corporate user
    const corporate = await Corporate.findOne({ email: email.toLowerCase() });
    if (!corporate) {
      console.error(`Corporate user with email ${email} not found`);
      process.exit(1);
    }

    // Hash the new password (using same salt rounds as User model: 12)
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password directly using findByIdAndUpdate to bypass pre-save hook
    await Corporate.findByIdAndUpdate(corporate._id, {
      password: hashedPassword
    }, { runValidators: false });

    console.log(`Password reset successfully for ${email}`);
    console.log('You can now login with the new password.');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
}

resetPassword();
