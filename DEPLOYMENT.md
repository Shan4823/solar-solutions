# 🚀 Deployment Guide — Solar Solutions

Deploy **free** using:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → Aiven (free MySQL in the cloud)

---

## Step 1 — Free Cloud MySQL (Aiven)

1. Go to **https://aiven.io** → Sign up free
2. Click **Create Service** → choose **MySQL** → select **Free plan**
3. Choose region closest to you → click **Create**
4. Wait ~2 min for it to start
5. Click your service → go to **Overview** tab
6. Copy these values (you'll need them in Step 3):
   - **Host** (e.g. `mysql-xyz.aivencloud.com`)
   - **Port** (e.g. `13306`)
   - **User** (`avnadmin`)
   - **Password** (click the eye icon)
   - **Database** (`defaultdb`)
7. Download the **CA Certificate** (click "CA Certificate" → Download)
8. Go to **Query Editor** tab → paste the entire contents of
   `database/scripts/01_create_database.sql`
   and click **Run** (change `USE solar_solutions` to `USE defaultdb` first if needed)
9. Also run `database/scripts/02_add_enquiries_table.sql`

---

## Step 2 — Deploy Backend to Render

1. Push your project to **GitHub** (create a repo if you haven't):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/solar-solutions.git
   git push -u origin main
   ```

2. Go to **https://render.com** → Sign up with GitHub

3. Click **New** → **Web Service** → connect your GitHub repo

4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Click **Advanced** → **Add Environment Variables**:
   ```
   DB_HOST       = mysql-xyz.aivencloud.com   (from Aiven)
   DB_PORT       = 13306                       (from Aiven)
   DB_USER       = avnadmin
   DB_PASSWORD   = your_aiven_password
   DB_NAME       = defaultdb
   JWT_SECRET    = any_long_random_string_here_32chars+
   JWT_EXPIRES_IN = 7d
   CLIENT_ORIGIN = https://your-app.vercel.app  (fill after Step 3)
   NODE_TLS_REJECT_UNAUTHORIZED = 0
   ```

6. Click **Create Web Service**
7. Wait for deployment → copy the URL: `https://solar-solutions-xyz.onrender.com`

---

## Step 3 — Deploy Frontend to Vercel

1. Go to **https://vercel.com** → Sign up with GitHub

2. Click **New Project** → Import your GitHub repo

3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Click **Environment Variables** → Add:
   ```
   VITE_API_URL = https://solar-solutions-xyz.onrender.com/api
   ```
   (Use the Render URL from Step 2)

5. Click **Deploy** → wait ~1 min

6. Copy your Vercel URL: `https://solar-solutions-abc.vercel.app`

---

## Step 4 — Connect Frontend ↔ Backend

1. Go back to **Render** → your web service → **Environment**
2. Update `CLIENT_ORIGIN` to your Vercel URL:
   ```
   CLIENT_ORIGIN = https://solar-solutions-abc.vercel.app
   ```
3. Click **Save Changes** → Render will redeploy automatically

---

## Step 5 — Verify

Open your Vercel URL → try:
- ✅ Main website loads
- ✅ Sign In with `admin@solarsolutions.in` / `Admin@1234`
- ✅ Admin dashboard opens
- ✅ Fill contact form → check Enquiries tab in admin
- ✅ Sign In as user → submit application → see it in dashboard

---

## ⚡ Quick Tips

| Issue | Fix |
|-------|-----|
| Backend sleeps after 15 min (free Render) | First request is slow — normal on free tier |
| CORS error | Make sure `CLIENT_ORIGIN` in Render matches your exact Vercel URL |
| DB connection refused | Add `NODE_TLS_REJECT_UNAUTHORIZED=0` to Render env vars |
| Vercel build fails | Make sure `VITE_API_URL` is set before deploying |

---

## Custom Domain (Optional — Free)

**Vercel**: Settings → Domains → Add your domain → follow DNS instructions  
**Render**: Settings → Custom Domains → Add domain

---

## Local Development (for reference)

```bash
# Terminal 1 — Database
# Run MySQL locally or keep using Aiven

# Terminal 2 — Backend
cd backend
cp .env.example .env   # fill in your DB details
npm install
npm run dev            # http://localhost:5000

# Terminal 3 — Frontend
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm install
npm run dev            # http://localhost:5173
```
