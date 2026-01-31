const mongoose = require('mongoose');

const connectDB = async () => {
  // Validate MONGODB_URI before attempting connection
  if (!process.env.MONGODB_URI) {
    console.error('\n❌ MongoDB Connection Error: MONGODB_URI is not defined');
    console.error('💡 Please set MONGODB_URI in your .env file\n');
    process.exit(1);
  }

  // Validate connection string format
  if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('\n❌ MongoDB Connection Error: Invalid MONGODB_URI format');
    console.error('💡 MONGODB_URI must start with mongodb:// or mongodb+srv://\n');
    process.exit(1);
  }

  // Set up connection event handlers before connecting
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected successfully');
  });

  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 30000, // Connection timeout
      maxPoolSize: 10, // Maximum number of connections in the pool
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);

  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:', error.message);
    
    // Check for specific error types
    if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('whitelisted')) {
      console.error('\n🔒 IP Whitelist Issue Detected!');
      console.error('\n💡 To fix this issue:');
      console.error('   1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com/');
      console.error('   2. Navigate to "Network Access" in the left menu');
      console.error('   3. Click "Add IP Address" button');
      console.error('   4. Click "Add Current IP Address" (recommended)');
      console.error('      OR Enter "0.0.0.0/0" for development (allows all IPs)');
      console.error('   5. Wait 1-2 minutes for the change to take effect');
      console.error('   6. Restart your server');
      console.error('\n📖 See MONGODB_IP_WHITELIST.md for detailed instructions.\n');
    } else if (error.message.includes('authentication') || error.message.includes('password')) {
      console.error('\n🔐 Authentication Error Detected!');
      console.error('\n💡 Troubleshooting steps:');
      console.error('   1. Verify your database username and password in MONGODB_URI');
      console.error('   2. Check if your database user exists in MongoDB Atlas');
      console.error('   3. Verify the user has proper database permissions');
      console.error('   4. Check if special characters in password are URL-encoded\n');
    } else if (error.message.includes('cluster') || error.message.includes('server') || error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT')) {
      console.error('\n🌐 Network/Cluster Connection Error!');
      console.error('\n💡 Troubleshooting steps:');
      console.error('   1. Verify your cluster name is correct in MONGODB_URI');
      console.error('   2. Check if your MongoDB Atlas cluster is running (not paused)');
      console.error('   3. Verify your network connection and firewall settings');
      console.error('   4. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('   5. Try adding "0.0.0.0/0" to Network Access (for development only)');
      console.error('   6. Check MongoDB Atlas status: https://status.mongodb.com/');
      console.error('   7. Wait a few minutes and try again (network issues may be temporary)\n');
    } else {
      console.error('\n💡 General Troubleshooting steps:');
      console.error('   1. Verify your MONGODB_URI in .env file');
      console.error('   2. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('   3. Verify your database credentials (username/password)');
      console.error('   4. Ensure your cluster is running in MongoDB Atlas');
      console.error('   5. Check network connectivity');
      console.error('   6. Try restarting your MongoDB Atlas cluster\n');
    }
    
    // Don't exit immediately - allow server to start and retry connection
    console.warn('⚠️  Server will continue to run. Database operations will fail until connection is established.\n');
    // Return instead of exiting to allow server to start
    return;
  }
};

module.exports = connectDB;
