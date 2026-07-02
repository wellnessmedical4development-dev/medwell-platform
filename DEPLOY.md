# Deploy to Heberjahiz (cPanel)

## Requirements
- Node.js app support via cPanel "Setup Node.js App" (CloudLinux)
- MySQL database (create via cPanel MySQL Databases)
- Domain or subdomain pointed to your hosting

---

## 1. Upload Files

**Via cPanel File Manager or FTP:**

```
your-domain/
├── public_html/          ← Frontend static files (client/dist/*)
├── backend/              ← Backend Node.js app (everything except client/)
└── .env                  ← Backend configuration
```

### Frontend
Upload contents of `client/dist/` to `public_html/`
Deploy `.htaccess` from `deploy/cpanel/.htaccess` to `public_html/`

### Backend
Upload the entire project root to `backend/` (or use Git).

---

## 2. Create Database

1. Go to **cPanel → MySQL Databases**
2. Create database: `medwell_db`
3. Create user with password
4. Add user to database (ALL PRIVILEGES)
5. Import schema:
   - Go to **phpMyAdmin**
   - Select your database
   - Import `src/database/schema.sql` (or run migrations via Node.js)

---

## 3. Configure Backend

In `backend/.env`:
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=medwell_db
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
JWT_SECRET=<generate-a-random-string>
```

---

## 4. Setup Node.js App (cPanel)

1. Go to **cPanel → Setup Node.js App**
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: 20.x or higher
   - **Application mode**: Production
   - **Application root**: `backend`
   - **Application URL**: your-domain.com
   - **Application startup file**: `server.js`
   - **Environment variables**: copy from `.env` or use the UI
4. Click **Create**
5. Click **Run NPM Install**
6. Click **Start App** (or Restart)

---

## 5. Run Migrations

In the Node.js app dashboard:
- Click **Run Script** and enter: `node src/database/migrate.js`

Or via SSH:
```bash
cd backend
node src/database/migrate.js
```

---

## 6. Seed Admin (optional)

```bash
node src/database/seeds/seed_all.js
```

Or manually via phpMyAdmin.

---

## 7. Verify

- `http://your-domain.com/` → Landing page
- `http://your-domain.com/api/health` → `{"status":"ok"}`
- `http://your-domain.com/login` → Login page

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Blank page on frontend | Check `.htaccess` is in `public_html/` |
| API returns 500 | Check backend logs in cPanel Node.js app dashboard |
| Cannot connect to DB | Verify DB credentials in `.env` and that user has access |
| Port already in use | Change `PORT` in `.env` or use a different app root |
