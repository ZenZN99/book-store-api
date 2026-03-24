# 📚 Book Store API – NestJS E-commerce Backend

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Node.js](https://img.shields.io/badge/Node.js-green)

## 🚀 Project Overview
**Book Store API** is a professional back-end application built with **NestJS** for managing an online book store.  
It provides a complete system including users, books, carts, cart items, and financial transactions with role-based access control (User / Admin).

The project is designed to be:
- Secure 🔐
- Scalable ⚙️
- Easy to integrate with Front-End applications (Next.js / React)

---

## 🧩 Features

### 👤 Authentication & Users
- Signup / Login using JWT
- Get current authenticated user (Me)
- Update avatar and cover images (Cloudinary)
- User roles:
  - USER
  - ADMIN
- Delete users (Admins only)
- Recharge user balance

---

### 📘 Books Management
- Create a book with image upload
- Update book details
- Delete books
- Get all books
- Get a single book

🔒 Authorization:
- Only the book owner or an Admin can update or delete a book

🖼 Images are uploaded and managed via **Cloudinary**

---

### 🛒 Cart System
- Automatically create a cart on first add
- Get user cart
- Add a book to cart
- Prevent duplicate books in the cart
- Update item quantity
- Remove item from cart
- Clear cart completely

---

### 💳 Transactions & Balance
- Transfer balance between users
- Validate balance before payment
- Execute operations inside a database transaction (Atomic)
- Create transaction records
- Clear cart after successful transaction

---

## 🛡 Security
- JWT Authentication Guard
- Role-based Authorization
- Input validation
- Protection against price and quantity manipulation
- Automatically delete old Cloudinary images on update

---

## 🛠 Tech Stack

### Back-End
- NestJS
- TypeScript
- Sequelize + PostgreSQL
- JWT Authentication
- Cloudinary
- bcrypt
- Multer

---

## 📂 Project Structure
src/
├─ controllers
├─ services
├─ schemas
├─ guards
├─ utils
└─ token

markdown
Copy code

---

## 🔗 API Endpoints

### Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET  `/api/auth/me`

### Books
- POST   `/api/book/create`
- PUT    `/api/book/update/:bookId`
- DELETE `/api/book/delete/:bookId`
- GET    `/api/book/books`
- GET    `/api/book/:bookId`

### Cart
- GET    `/api/cart/user`
- DELETE `/api/cart/user`

### Cart Items
- POST   `/api/cart-item/add/:bookId`
- PUT    `/api/cart-item/update/:cartItemId`
- DELETE `/api/cart-item/remove/:cartItemId`

### Transactions
- POST `/api/transaction/transfer`
- POST `/api/transaction/recharge`

---

## ⚙️ Installation & Running

### Prerequisites
- Node.js
- PostgreSQL
- Cloudinary Account
- Git

### Steps

1. Clone the repository
```bash
git clone https://github.com/ZenZN99/book-store-api
cd book-store-api
Install dependencies

bash
Copy code
npm install
Environment variables
Create a .env file in the root directory:

.env.example

Run the server

bash
Copy code
npm run start:dev
The server will run on:

arduino
Copy code
http://localhost:3000
🎯 Future Enhancements
Orders history

Discount & coupons system

Wishlist

Reviews & ratings

Payment gateway integration

👨‍💻 Author
Zen – Backend Engineer

📜 License
MIT License © 2026 Zen
