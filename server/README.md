# Project Management API

A robust RESTful API for managing projects and tasks with user authentication, email verification, and comprehensive project management capabilities.

## 🚀 Features

- **User Authentication & Authorization**: Secure user registration, login, and email verification
- **Project Management**: Create, read, update, and delete projects with detailed metadata
- **Task Management**: Comprehensive task handling with assignment, status tracking, and deadlines
- **Email Verification**: Automatic email verification for new user registrations
- **JWT Authentication**: Secure token-based authentication system
- **MongoDB Integration**: Scalable NoSQL database with Mongoose ODM
- **Input Validation**: Comprehensive data validation and error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Email Service**: Nodemailer for email verification
- **Environment**: dotenv for configuration management
- **Module System**: ES6 Modules

## 📁 Project Structure

```
codsoft/
├── controller/          # Business logic controllers
│   ├── authController.js    # User authentication logic
│   ├── projectController.js # Project management logic
│   └── taskController.js    # Task management logic
├── model/              # Database schemas
│   ├── UserSchema.js       # User data model
│   ├── ProjectSchema.js    # Project data model
│   └── TaskSchema.js       # Task data model
├── routes/             # API route definitions
│   ├── userRoutes.js       # Authentication routes
│   ├── projectRoutes.js    # Project management routes
│   └── taskRoutes.js       # Task management routes
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Gmail account for email verification (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd codsoft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWTTOKEN=your_jwt_secret_key
   EMAIL_ADMIN=your_gmail_address
   PASS_ADMIN=your_gmail_app_password
   CLIENT_URL=your_frontend_url
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on port 5000 (or the port specified in your environment variables).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### 1. Authentication Routes (`/api/auth/`)

#### User Registration
- **POST** `/register`
- **Description**: Register a new user with email verification
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: User registration confirmation with verification email sent

#### Email Verification
- **GET** `/verify-email/:token`
- **Description**: Verify user email using JWT token
- **Parameters**: `token` - JWT verification token
- **Response**: Email verification confirmation

#### User Login
- **POST** `/login`
- **Description**: Authenticate user and return JWT access token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: Login confirmation with JWT access token

#### Get User by ID
- **GET** `/user/:id`
- **Description**: Retrieve user information by ID
- **Parameters**: `id` - User's MongoDB ObjectId
- **Response**: User object (password excluded)

#### User Logout
- **POST** `/logout`
- **Description**: Logout user (client-side token clearing)
- **Response**: Logout confirmation

### 2. Project Management Routes (`/api/proj/`)

#### Create Project
- **POST** `/create`
- **Description**: Create a new project for a user
- **Request Body**:
  ```json
  {
    "userID": "user_mongodb_id",
    "projectData": {
      "name": "Project Name",
      "description": "Project Description",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "status": "active"
    }
  }
  ```
- **Response**: Created project object

#### Get User Projects
- **GET** `/:userID/projects`
- **Description**: Retrieve all projects for a specific user
- **Parameters**: `userID` - User's MongoDB ObjectId
- **Response**: Array of user's projects

#### Get Project by ID
- **GET** `/:userID/projects/:projectID`
- **Description**: Retrieve a specific project by ID
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Response**: Project object

#### Update Project Title
- **PUT** `/:userID/projects/:projectID/title`
- **Description**: Update project name
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Request Body**: `{"name": "New Project Name"}`
- **Response**: Updated project object

#### Update Project Description
- **PUT** `/:userID/projects/:projectID/description`
- **Description**: Update project description
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Request Body**: `{"description": "New description"}`
- **Response**: Updated project object

#### Update Project Start Date
- **PUT** `/:userID/projects/:projectID/start-date`
- **Description**: Update project start date
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Request Body**: `{"startDate": "2024-02-01"}`
- **Response**: Updated project object

#### Update Project End Date
- **PUT** `/:userID/projects/:projectID/end-date`
- **Description**: Update project end date
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Request Body**: `{"endDate": "2024-11-30"}`
- **Response**: Updated project object

#### Update Project Status
- **PUT** `/:userID/projects/:projectID/status`
- **Description**: Update project status
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Request Body**: `{"status": "completed"}`
- **Valid Statuses**: `"active"`, `"completed"`, `"pending"`
- **Response**: Updated project object

#### Delete Project
- **DELETE** `/:userID/projects/:projectID`
- **Description**: Delete a project and all its tasks
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Response**: Deletion confirmation

### 3. Task Management Routes (`/api/task/`)

#### Create Task
- **POST** `/create`
- **Description**: Create a new task within a project
- **Request Body**:
  ```json
  {
    "userID": "user_mongodb_id",
    "projectID": "project_mongodb_id",
    "taskData": {
      "title": "Task Title",
      "description": "Task Description",
      "assignTo": "assigned_user_id",
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "status": "pending"
    }
  }
  ```
- **Response**: Created task object

#### Get Project Tasks
- **GET** `/:userID/projects/:projectID/tasks`
- **Description**: Retrieve all tasks for a specific project
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
- **Response**: Array of project tasks

#### Get Task by ID
- **GET** `/:userID/projects/:projectID/tasks/:taskID`
- **Description**: Retrieve a specific task by ID
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Response**: Task object

#### Update Task Status
- **PUT** `/update-status`
- **Description**: Update task status
- **Request Body**:
  ```json
  {
    "userID": "user_mongodb_id",
    "projectID": "project_mongodb_id",
    "taskID": "task_mongodb_id",
    "status": "in-progress"
  }
  ```
- **Valid Statuses**: `"pending"`, `"in-progress"`, `"completed"`, `"overdue"`
- **Response**: Updated task object

#### Update Task Title
- **PUT** `/:userID/projects/:projectID/tasks/:taskID/title`
- **Description**: Update task title
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Request Body**: `{"title": "New Task Title"}`
- **Response**: Updated task object

#### Update Task Description
- **PUT** `/:userID/projects/:projectID/tasks/:taskID/description`
- **Description**: Update task description
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Request Body**: `{"description": "New task description"}`
- **Response**: Updated task object

#### Update Task Assignment
- **PUT** `/:userID/projects/:projectID/tasks/:taskID/assign`
- **Description**: Reassign task to another user
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Request Body**: `{"assignTo": "new_user_id"}`
- **Response**: Updated task object

#### Update Task Start Date
- **PUT** `/:userID/projects/:projectID/tasks/:taskID/start-date`
- **Description**: Update task start date
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Request Body**: `{"startDate": "2024-02-01"}`
- **Response**: Updated task object

#### Update Task End Date
- **PUT** `/:userID/projects/:projectID/tasks/:taskID/end-date`
- **Description**: Update task end date
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Request Body**: `{"endDate": "2024-02-28"}`
- **Response**: Updated task object

#### Delete Task
- **DELETE** `/:userID/projects/:projectID/tasks/:taskID`
- **Description**: Delete a specific task
- **Parameters**: 
  - `userID` - User's MongoDB ObjectId
  - `projectID` - Project's MongoDB ObjectId
  - `taskID` - Task's MongoDB ObjectId
- **Response**: Deletion confirmation

## 🗄️ Data Models

### User Schema
```javascript
{
  email: String (required, unique, validated),
  password: String (required, hashed),
  verified: Boolean (default: false),
  projects: [ProjectSchema]
}
```

### Project Schema
```javascript
{
  name: String (required),
  description: String,
  startDate: Date (required),
  endDate: Date,
  status: String (enum: "active", "completed", "pending"),
  tasks: [TaskSchema]
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  assignTo: String (user ID),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: "pending", "in-progress", "completed", "overdue")
}
```

## 🔐 Authentication & Security

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Secure authentication using JSON Web Tokens with configurable expiration
- **Email Verification**: New users must verify their email before accessing the system
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Secure error responses that don't expose sensitive information

## 📧 Email Configuration

The system uses Nodemailer with Gmail SMTP for email verification. To configure:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Set environment variables:
   - `EMAIL_ADMIN`: Your Gmail address
   - `PASS_ADMIN`: Your Gmail app password
   - `CLIENT_URL`: Your frontend application URL

## 🚦 Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

## 🧪 Testing

Test the server health endpoint:
```bash
GET http://localhost:5000/test
```

Expected response:
```json
{
  "message": "Server is working!"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ for project management and task tracking.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Note**: Make sure to set up your environment variables properly and have MongoDB running before starting the application.
