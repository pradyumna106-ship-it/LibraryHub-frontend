# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# LibraryHub-frontend

LibraryHub Frontend is a modern and responsive web application built using React and Vite. It provides an intuitive user interface for managing library operations such as browsing books, requesting issues, and handling administrative tasks.

---

## 🚀 Features

- 🎨 Clean and user-friendly UI
- 🔐 Authentication (Login/Register)
- 📚 Book browsing and search
- 🔄 Borrow request system
- ✅ Admin approval dashboard
- 📊 Dynamic data rendering
- ⚡ Fast performance with Vite

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite)
- **Styling:** CSS / Tailwind (if used, update this)
- **State Management:** React Hooks
- **Routing:** React Router
- **API Integration:** Axios / Fetch

---

## 📂 Project Structure
<br> <pre>
|───src
│   App.jsx
│   index.css
│   main.jsx
│   routes.js
│   setupTests.js
│   tailwind.css
│   theme.css
|    ├───api
|    ├───assets
|    ├───components
|    ├───data
|    ├───pages
|    └───utils
|
|
<pre> </br>


---

## 🔑 Main Modules

### 👤 Authentication
- User Login
- User Registration

### 📚 Book Management UI
- View books
- Search books
- Book details display

### 🔄 Borrow System
- Send borrow request
- View request status

### 🧑‍💼 Admin Dashboard
- Approve / Reject requests
- Manage books and users

---

## 🔄 Workflow

1. User logs in/registers
2. User browses available books
3. User sends borrow request
4. Admin approves/rejects request
5. Status is updated in UI

---

## ⚙️ Installation & Setup

```bash id="runfrontend"
# Clone repository
git clone https://github.com/your-username/LibraryHub-frontend.git

# Navigate to project
cd LibraryHub-frontend

# Install dependencies
npm install

# Start development server
npm run dev