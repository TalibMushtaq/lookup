# LOOKUP - Course Management Platform

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Lookup is a lightweight course management platform built with Node.js, Express, and MongoDB. This project serves as a practical exercise in backend development, covering essential concepts like RESTful APIs, user authentication, and database management.

## ✨ Features

-   **User Authentication**: Secure user registration and login with JWT.
-   **Admin Dashboard**: Admins can create, update, and manage courses.
-   **Course Catalog**: Users can browse all available courses.
-   **Course Enrollment**: Users can purchase/enroll in courses.
-   **Secure & Validated**: Uses `bcrypt` for password hashing and `zod` for robust input validation.
-   **Simple Frontend**: A clean, responsive frontend built with vanilla HTML, CSS, and JavaScript.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JSON Web Tokens (JWT)
-   **Validation**: Zod
-   **Security**: bcrypt
-   **Development**: Nodemon

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm
-   MongoDB (A connection string from MongoDB Atlas is recommended)

### Installation & Setup

1.  **Clone the repository:**
    ````sh
    git clone https://github.com/TalibMushtaq/lookup.git
    cd lookup
    ````

2.  **Install dependencies:**
    ````sh
    npm install
    ````

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables. You can use the `.env.example` file as a template.

    ````env
    # Database Configuration
    MONGODB_URI=your_mongodb_connection_string

    # Server Configuration
    PORT=3000

    # JWT Secrets
    JWT_Admin=your_admin_secret_key
    JWT_User=your_user_secret_key
    ````

### Running the Application

-   **Development Mode** (with auto-reloading):
    ````sh
    npm run dev
    ````

-   **Production Mode**:
    ````sh
    npm start
    ````

The server will be running at `http://localhost:3000`.

## 📁 Project Structure

```
lookup/
├── .env                # Environment variables
├── database.js         # MongoDB connection and schemas
├── index.js            # Main server entry point
├── package.json
├── middlewares/
│   └── auth.js         # Authentication middleware (JWT)
├── public/             # Frontend static files
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── routes/
│   ├── admin.js        # Admin-specific routes
│   ├── course.js       # Course-related routes
│   └── user.js         # User-specific routes
└── validators/
    └── schemas.js      # Zod validation schemas
```

## 📖 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint                  | Description                     | Access  |
| :----- | :------------------------ | :------------------------------ | :------ |
| `POST` | `/admin/signup`           | Register a new admin account.   | Public  |
| `POST` | `/admin/signin`           | Log in as an admin.             | Public  |
| `POST` | `/admin/course`           | Create a new course.            | Admin   |
| `PUT`  | `/admin/course/:courseId` | Update an existing course.      | Admin   |
| `GET`  | `/admin/course/bulk`      | Get all courses created by admin.| Admin   |
| `POST` | `/user/signup`            | Register a new user account.    | Public  |
| `POST` | `/user/signin`            | Log in as a user.               | Public  |
| `GET`  | `/user/purchased`         | Get all purchased courses.      | User    |
| `GET`  | `/course/preview`         | Get a preview of all courses.   | Public  |
| `POST` | `/course/purchase/:courseId`| Purchase a course.            | User    |

## 📜 License

This project is licensed under the MIT License - see LICENSE
