📘 BACKEND README (backend/README.md)

(Only needed if you keep an Express backend. Not required for Supabase-only setup.)

# 🧠 Memory Vault – Backend

This is the optional backend server for the Memory Vault application.

⚠️ This backend is NOT required if using Supabase directly for database and storage.

---

## 🚀 Purpose

The backend can be used for:

- Custom API logic
- Authentication middleware
- Secure data processing
- Business logic handling
- Third-party integrations

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- CORS
- dotenv

---

## 📂 Project Structure


backend/
├── server.js
├── routes/
├── controllers/
├── middleware/
└── package.json


---

## 🚀 Getting Started

### 1️⃣ Navigate to Backend Folder


cd backend


---

### 2️⃣ Install Dependencies


npm install


---

### 3️⃣ Setup Environment Variables

Create a `.env` file:


PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key


---

### 4️⃣ Start Server


npm run dev


Server runs at:


http://localhost:5000


---

## 📡 Example API Endpoints


GET /api/memories
POST /api/memories
DELETE /api/memories/:id


---

## 🔒 Security

If used in production:

- Enable authentication middleware
- Use Supabase service role securely
- Validate incoming requests
- Enable CORS restrictions

---

## 📦 Deployment

Backend can be deployed on:

- Render
- Railway
- Heroku
- AWS EC2

---

## 📌 Note

If using Supabase directly in frontend, this backend is optional and may not be needed.