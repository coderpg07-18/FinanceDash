<div align="center">

# 💰 FinanceDash

### A Full-Stack Financial Management Dashboard

Built with the **MERN Stack** — MongoDB, Express.js, React, Node.js

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=nodedotjs)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

</div>

---

## 📌 Overview

**FinanceDash** is a full-stack personal finance management web application that helps users track income and expenses, manage budgets, and generate financial reports — all in one place.

Built following a clean **MVC architecture** on the backend and a component-based **React** frontend with JWT-based authentication and role-based access control.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login / signup / logout
- Role-Based Access Control — `admin` and `user` roles
- Forgot password via email (Nodemailer)
- Reset password with secure tokenized link
- Password change from profile
- Profile picture upload via Cloudinary

### 💸 Transactions
- Add, edit, delete income & expense transactions
- Filter by type, date range, and search by title
- Pagination with infinite scroll (Load More)
- Transaction detail page
- Export transactions to CSV

### 📊 Dashboard & Reports
- Monthly summary cards (Income, Expense, Balance, Count)
- Bar chart — monthly income vs expense overview
- Category breakdown — top spending categories
- Year overview with monthly table
- Savings rate calculation

### 💼 Budget Manager
- Set monthly budgets per category
- Real-time progress bars with color-coded warnings
- ⚠️ Alert when 80% or 100% of budget is used

### 🎨 UI/UX
- Dark / Light mode toggle
- Toast notifications (success, error, info)
- Mobile responsive with hamburger menu
- Clean dark-first design

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Nodemailer | Password reset emails |
| Cloudinary + Multer | Image uploads |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| React Router v6 | Client-side routing |
| Context API | Global state (Auth, Theme, Toast) |
| CSS Variables | Dark/light theming |

---

## 📁 Project Structure

```
financial-dashboard/
│
├── backend/
│   ├── controllers/
│   │   ├── user.js          # Auth, profile, password reset
│   │   ├── transaction.js   # CRUD + reports + CSV export
│   │   ├── category.js      # Category management
│   │   └── budget.js        # Budget management
│   │
│   ├── models/
│   │   ├── User.js          # User schema + bcrypt
│   │   ├── Transaction.js   # Transaction schema
│   │   ├── Category.js      # Category schema
│   │   └── Budget.js        # Budget schema
│   │
│   ├── routes/
│   │   ├── users.js
│   │   ├── transactions.js
│   │   ├── categories.js
│   │   └── budgets.js
│   │
│   ├── utils/
│   │   ├── ExpressError.js  # Custom error class
│   │   ├── wrapAsync.js     # Async error wrapper
│   │   ├── sendEmail.js     # Nodemailer helper
│   │   └── cloudinaryConfig.js
│   │
│   ├── init/
│   │   ├── data.js          # Seed data (15 default categories)
│   │   └── index.js         # DB seed script
│   │
│   ├── middleware.js         # isLoggedIn, isOwner, isAdmin, validate
│   ├── Schema.js             # Joi validation schemas
│   ├── app.js               # Express app entry point
│   └── .env                 # Environment variables
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        │
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ThemeContext.jsx
        │   └── ToastContext.jsx
        │
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   ├── Dashboard.jsx
        │   ├── Transactions.jsx
        │   ├── TransactionForm.jsx
        │   ├── TransactionDetail.jsx
        │   ├── Budgets.jsx
        │   ├── Reports.jsx
        │   ├── Profile.jsx
        │   └── Admin.jsx
        │
        ├── utils/
        │   └── api.js        # Centralized fetch utility
        │
        ├── styles/
        │   └── main.css
        │
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Cloudinary account (for image uploads)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/financial-dashboard.git
cd financial-dashboard
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
# MongoDB
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/financialDB

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=8080
CLIENT_URL=http://localhost:5173

# Email (Gmail App Password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

Seed the database (creates default categories + admin user):

```bash
node init/index.js
```

Start the backend server:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

Server runs at → `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

### 4. Default Admin Credentials

```
Email:    admin@financialdash.com
Password: Admin@123
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/login` | Login |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/change-password` | Change password |
| POST | `/api/users/forgot-password` | Send reset email |
| POST | `/api/users/reset-password/:token` | Reset password |
| PUT | `/api/users/avatar` | Upload avatar |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all (with search/filter) |
| GET | `/api/transactions/summary` | Dashboard summary |
| GET | `/api/transactions/reports/monthly` | Monthly report |
| GET | `/api/transactions/reports/categories` | Category report |
| GET | `/api/transactions/export` | Export CSV |
| GET | `/api/transactions/:id` | Get single |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get budgets by month/year |
| POST | `/api/budgets` | Create budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

---

## 🌍 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | JWT signing key |
| `JWT_EXPIRES_IN` | ✅ | Token expiry e.g. `7d` |
| `PORT` | ✅ | Backend server port |
| `CLIENT_URL` | ✅ | Frontend URL for CORS |
| `EMAIL_USER` | ⚙️ | Gmail address for emails |
| `EMAIL_PASS` | ⚙️ | Gmail App Password |
| `CLOUD_NAME` | ⚙️ | Cloudinary cloud name |
| `CLOUD_API_KEY` | ⚙️ | Cloudinary API key |
| `CLOUD_API_SECRET` | ⚙️ | Cloudinary API secret |

✅ Required to run &nbsp;&nbsp; ⚙️ Required for specific features

---

## 📸 Screenshots

> Dashboard with income/expense summary and charts

> Transaction list with search and filter

> Budget manager with progress tracking

> Reports page with year overview and category breakdown

---

## 🚢 Deployment

### Backend → Render (Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo → select `backend/` as root
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all `.env` variables in Render dashboard

### Frontend → Vercel (Free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo → select `frontend/` as root
3. Add `VITE_API_URL=https://your-render-app.onrender.com/api`
4. Deploy

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Prince Gupta**

⭐ Star this repo if you found it helpful!

</div>
