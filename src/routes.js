import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ViewAllBooks from "./components/ViewAllBooks.jsx";
import MyBooks from "./components/MyBooks.jsx";
import BorrowedBooks from "./components/BorrowedBooks.jsx";
import History from "./components/History.jsx";
import Profile from "./components/Profile.jsx";
import LoginType from "./components/LoginType.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";
import LogIn from "./components/LogIn.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "view-all-books", Component: ViewAllBooks },
      { path: "my-books", Component: MyBooks },
      { path: "borrowed-books", Component: BorrowedBooks },
      { path: "history", Component: History },
      { path: "profile", Component: Profile },
    ],
  },
    {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: LoginType },
      { path: "login/:role", Component: LogIn }
    ],
  },
]);