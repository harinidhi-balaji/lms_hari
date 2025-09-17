# phpMyAdmin Access Guide

## 🔗 Access URL
**phpMyAdmin URL:** [http://localhost:8081](http://localhost:8081)

## 🔐 Login Credentials
- **Server:** `lms-mysql` (or leave empty - it should auto-connect)
- **Username:** `root`
- **Password:** `rootpassword`

## 🐳 Container Status
✅ **MySQL Container:** `lms-mysql` - Running on port 3306
✅ **phpMyAdmin Container:** `lms-phpmyadmin` - Running on port 8081

## 🔧 Troubleshooting

### If you can't access http://localhost:8081:

1. **Check containers are running:**
   ```bash
   docker ps | grep -E "(phpmyadmin|mysql)"
   ```

2. **Restart phpMyAdmin container:**
   ```bash
   docker restart lms-phpmyadmin
   ```

3. **Check phpMyAdmin logs:**
   ```bash
   docker logs lms-phpmyadmin --tail 10
   ```

4. **Alternative access via Docker IP:**
   ```bash
   docker inspect lms-phpmyadmin | grep IPAddress
   ```

### If login fails:

1. **Verify MySQL is accessible:**
   ```bash
   docker exec lms-mysql mysql -u root -prootpassword -e "SELECT 1;"
   ```

2. **Check MySQL container logs:**
   ```bash
   docker logs lms-mysql --tail 10
   ```

### If browser shows error:

1. **Try different browsers** (Chrome, Firefox, Edge)
2. **Clear browser cache** and cookies
3. **Disable browser extensions** that might block connections
4. **Check if localhost is blocked** - try `127.0.0.1:8081` instead

## 📊 Database Information
- **Database Name:** `lms_db`
- **Tables:** courses, users, enrollments, lessons, etc.
- **Data:** Demo users and courses should be visible

## 🆘 Quick Fix Commands

If phpMyAdmin is completely broken, restart everything:
```bash
# Stop containers
docker stop lms-phpmyadmin lms-mysql

# Start containers
docker start lms-mysql
sleep 5
docker start lms-phpmyadmin

# Wait 10 seconds then try: http://localhost:8081
```

## ✅ Success Check
Once logged in, you should see:
- Left sidebar with `lms_db` database
- Tables like `courses`, `users`, `enrollments`
- Sample data in the tables