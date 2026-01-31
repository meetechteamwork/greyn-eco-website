# 🔧 Quick Fix: MongoDB Atlas IP Whitelist

## Your Current IP Address

**IP Address:** `165.99.41.98`

## ⚡ Quick Fix (Choose One)

### Option 1: Add Your Current IP (Recommended)

1. **Go to MongoDB Atlas:**
   👉 https://cloud.mongodb.com/v2#/security/network/whitelist

2. **Click "Add IP Address"** (green button)

3. **Click "Add Current IP Address"** button
   - This automatically adds: `165.99.41.98`

4. **Click "Confirm"**

5. **Wait 1-2 minutes** for the change to take effect

6. **Restart your server:**
   ```bash
   cd backend
   npm run dev
   ```

### Option 2: Allow All IPs (Development Only)

1. **Go to MongoDB Atlas:**
   👉 https://cloud.mongodb.com/v2#/security/network/whitelist

2. **Click "Add IP Address"**

3. **Enter:** `0.0.0.0/0`

4. **Add Comment:** "Development - Allow all IPs"

5. **Click "Confirm"**

6. **Wait 1-2 minutes** then restart your server

⚠️ **Warning**: Option 2 allows access from ANY IP address. Only use for development!

## ✅ Verify It's Working

After whitelisting and restarting, you should see:
```
✅ MongoDB Atlas Connected: ...
📊 Database: greyn-eco
🚀 Server running on port 5000
```

## 📖 Need More Help?

See `MONGODB_IP_WHITELIST.md` for detailed troubleshooting guide.

## 🔍 Check Your IP Anytime

Run this command to see your current IP:
```bash
npm run get-ip
```
