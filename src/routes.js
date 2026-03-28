import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ViewAllBooks from "./pages/ViewAllBooks.jsx";
import MyBooks from "./pages/MyBooks.jsx";
import BorrowedBooks from "./pages/BorrowedBooks.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import LoginType from "./pages/LoginType.jsx";
import AuthLayout from "./components/AuthLayout.jsx";

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
    ],
  },
]);