# 🧾 InvoiceGenie

> A modern full-stack **Invoice Management Web App** built with **Django REST Framework + React (Vite)**.  
> Manage clients, create invoices, track payments, and view income analytics — all from a clean dashboard.

---

![Made with Django](https://img.shields.io/badge/Made%20with-Django-092E20?style=for-the-badge&logo=django)
![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![REST API](https://img.shields.io/badge/API-DRF-red?style=for-the-badge&logo=python)
![Tailwind CSS](https://img.shields.io/badge/Styled%20With-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-blue?style=for-the-badge)

---

## 🚀 Tech Stack

**Frontend:** React (Vite), Axios, TailwindCSS, Recharts  
**Backend:** Django, Django REST Framework  
**Database:** SQLite (Dev)  
**Authentication:** JWT Tokens (Access + Refresh)

---

## ✨ Features

- 🔐 User Registration & Login (JWT Auth)
- 🧾 Create, Update, and Delete Invoices
- 📊 Dashboard with Monthly Income Charts
- 🔍 Search & Filter Invoices (by name, email, status)
- 📂 Separate Invoices Page with Pagination
- 🧮 Auto Calculated Totals with Tax
- 📱 Fully Responsive UI
- 🚪 Secure Logout Flow

---

## ⚙️ Environment Variables

Create a `.env` file in your **backend** directory and include:

```env
DJANGO_SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
ACCESS_TOKEN_LIFETIME_MINUTES = 30
REFRESH_TOKEN_LIFETIME_DAYS = 7
## if you deploy later
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 🧠 Installation

1. Clone the repository
```
git clone https://github.com/<your-username>/invoicegenie.git
cd invoicegenie
```
2. Backend Setup
```
cd backend
python -m venv env
  ## On Windows
env\Scripts\activate
  ## On macOS/Linux
  source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
3. Frontend Setup
```
cd frontend
npm install
npm run dev
```
4. Now open:
   
👉 Frontend: http://localhost:5173

👉 Backend API: http://localhost:8000/api/

## 📊 Dashboard Preview

 - Displays total invoices, paid/unpaid count
 - Monthly income bar chart
 - Recent invoices
 - Pie chart showing paid vs unpaid distribution

## 📸 Screenshots

Dashbord

<img width="700" height="550" alt="Dashboard" src="https://github.com/user-attachments/assets/8f8f4e46-70c2-4b09-add0-2215950bdb11" />

All Invoice

<img width="700" height="550" alt="Invoice_List" src="https://github.com/user-attachments/assets/fdedfd1d-0798-4045-9a95-1fb4041139d3" />




## 🧰 Folder Structure
```
invoicegenie/
├── backend/
│   ├── invoices/          # Django app (models, serializers, views)
│   ├── users/             # Authentication endpoints
│   ├── settings.py        # DRF & JWT configuration
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, CreateInvoice, etc.
│   │   ├── components/    # Navbar, ProtectedRoute, etc.
│   │   ├── auth/          # Auth context
│   │   └── api/           # Axios instance
│   └── ...
└── README.md
```

## 🧑‍💻 Author

Lavish Mishra

Backend Developer | Django & React Enthusiast
