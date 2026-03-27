// Mock data for the library management system


// export const books = [
//   {
//     id: 1,
//     title: "Harry Potter and the Cursed Child",
//     author: "J.K. Rowling",
//     category: "Fiction",
//     price: "$10",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 2,
//     title: "The Hobbit",
//     author: "J.R.R. Tolkien",
//     category: "Fantasy",
//     price: "$12",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 3,
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     category: "Classic",
//     price: "$8",
//     available: false,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 4,
//     title: "1984",
//     author: "George Orwell",
//     category: "Dystopian",
//     price: "$9",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 5,
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     category: "Classic",
//     price: "$11",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 6,
//     title: "Pride and Prejudice",
//     author: "Jane Austen",
//     category: "Romance",
//     price: "$10",
//     available: false,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 7,
//     title: "The Catcher in the Rye",
//     author: "J.D. Salinger",
//     category: "Fiction",
//     price: "$13",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   },
//   {
//     id: 8,
//     title: "Lord of the Flies",
//     author: "William Golding",
//     category: "Fiction",
//     price: "$7",
//     available: true,
//     image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
//   }
// ];

export const borrowedBooks = [
  {
    id: 1,
    title: "Harry Potter and the Cursed Child",
    author: "J.K. Rowling",
    borrowDate: "2026-03-15",
    dueDate: "2026-04-05",
    status: "Active",
    fine: "$0"
  },
  {
    id: 2,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    borrowDate: "2026-03-10",
    dueDate: "2026-03-31",
    status: "Active",
    fine: "$0"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    borrowDate: "2026-03-05",
    dueDate: "2026-03-26",
    status: "Overdue",
    fine: "$5"
  }
];

export const historyData = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    borrowDate: "2026-02-01",
    returnDate: "2026-02-20",
    status: "Returned",
    fine: "$0"
  },
  {
    id: 2,
    title: "Pride and Prejudice",
    borrowDate: "2026-01-15",
    returnDate: "2026-02-10",
    status: "Returned",
    fine: "$3"
  },
  {
    id: 3,
    title: "The Great Gatsby",
    borrowDate: "2026-01-05",
    returnDate: "2026-01-25",
    status: "Returned",
    fine: "$0"
  },
  {
    id: 4,
    title: "The Catcher in the Rye",
    borrowDate: "2025-12-20",
    returnDate: "2026-01-10",
    status: "Returned",
    fine: "$0"
  }
];

export const myBooks = [
  {
    id: 1,
    title: "Harry Potter and the Cursed Child",
    author: "J.K. Rowling",
    category: "Fiction",
    price: "$10",
    image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
  },
  {
    id: 2,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    price: "$12",
    image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    price: "$9",
    image: "figma:asset/31512d522c1d6eef2bb94026857479b1cf9d1b38.png"
  }
];

export const notifications = [
  {
    id: 1,
    type: "overdue",
    title: "Book Overdue",
    message: "1984 is overdue. Please return it soon to avoid additional fines.",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    type: "reminder",
    title: "Due Date Reminder",
    message: "The Hobbit is due in 3 days (March 31, 2026)",
    time: "1 day ago",
    read: false
  },
  {
    id: 3,
    type: "success",
    title: "Book Reserved",
    message: "Your reserved book 'The Lord of the Rings' is now available for pickup.",
    time: "2 days ago",
    read: true
  },
  {
    id: 4,
    type: "info",
    title: "New Books Available",
    message: "Check out the latest additions to our Fantasy collection!",
    time: "3 days ago",
    read: true
  },
  {
    id: 5,
    type: "reminder",
    title: "Due Date Reminder",
    message: "Harry Potter and the Cursed Child is due in 5 days (April 5, 2026)",
    time: "5 days ago",
    read: true
  }
];

export const userProfile = {
  id: "M12345",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  memberSince: "2025-01-15",
  address: "123 Library Street, Booktown, BT 12345",
  borrowedCount: 3,
  totalBorrowed: 24,
  totalFines: "$8",
  activeLoans: 3,
  avatar: null
};

export const dashboardStats = {
  borrowed: 3,
  dueDate: "March 31, 2026",
  fine: "$5"
};
