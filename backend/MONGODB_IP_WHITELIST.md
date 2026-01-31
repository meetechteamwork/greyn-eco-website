# MongoDB Atlas IP Whitelist Setup Guide

## Current Error

You're seeing this error because your IP address is not whitelisted in MongoDB Atlas:
```
❌ MongoDB Connection Error: Could not connect to any servers in your MongoDB Atlas cluster.
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## Quick Fix - Whitelist Your IP Address

### Step 1: Get Your Current IP Address

**Option A - From Terminal:**
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "https://api.ipify.org?format=json"

# Or visit in browser:
https://api.ipify.org
```

**Option B - From MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in the left menu
3. Click "Add IP Address" button
4. You'll see "Add Current IP Address" option

### Step 2: Whitelist Your IP in MongoDB Atlas

1. **Login to MongoDB Atlas:**
   - Go to: https://cloud.mongodb.com/
   - Login with your account

2. **Navigate to Network Access:**
   - Click "Network Access" in the left sidebar
   - Or go directly to: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add IP Address:**
   - Click the green "Add IP Address" button
   - Choose one of these options:

   **Option A - Add Your Current IP (Recommended for Production):**
   - Click "Add Current IP Address" button
   - Click "Confirm"
   - This adds only your current IP address

   **Option B - Allow All IPs (Development Only - Not Recommended for Production):**
   - Enter: `0.0.0.0/0`
   - Add a comment: "Development - Allow all IPs"
   - Click "Confirm"
   - ⚠️ **WARNING**: This allows access from any IP address. Only use for development!

4. **Wait for IP to be Active:**
   - New IP addresses can take 1-2 minutes to become active
   - You'll see the status change from "Pending" to "Active"

### Step 3: Test Connection

After whitelisting your IP, restart your backend server:

```bash
cd backend
npm run dev
```

You should now see:
```
✅ MongoDB Atlas Connected: ...
📊 Database: greyn-eco
```

## Development Option: Allow All IPs

If you're developing and your IP changes frequently, you can temporarily allow all IPs:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Enter: `0.0.0.0/0`
4. Add comment: "Development - Temporary"
5. Click "Confirm"

⚠️ **Important**: Remember to remove this rule and add specific IPs before production!

## Troubleshooting

### If connection still fails after whitelisting:

1. **Wait 2-3 minutes** - IP whitelist changes can take time to propagate

2. **Check your IP address** - Your IP might have changed:
   ```bash
   # Check your current IP
   Invoke-RestMethod -Uri "https://api.ipify.org?format=json"
   ```

3. **Verify connection string** - Make sure your `.env` file has the correct MONGODB_URI:
   ```env
   MONGODB_URI=mongodb+srv://muhammadfaaranakbar_db_user:KtDsQ6bcVXANLRCT@greyn-dev-cluster.22hoofz.mongodb.net/greyn-eco?retryWrites=true&w=majority&appName=greyn-dev-cluster
   ```

4. **Check database user** - Verify your database user credentials are correct

5. **Check cluster status** - Make sure your MongoDB Atlas cluster is running (not paused)

## Security Best Practices

1. **Production**: Only whitelist specific IP addresses
2. **Development**: Use `0.0.0.0/0` only temporarily
3. **Regular Review**: Periodically review and remove unused IP addresses
4. **VPN Users**: If using VPN, whitelist your VPN IP address

## Need Help?

If you're still having issues:
1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Verify cluster is not paused
3. Check MongoDB Atlas logs for more details
4. Ensure database user has proper permissions
