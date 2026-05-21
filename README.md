# Notes App Backend with Analytics and Search API

This project is a backend API for a Notes App built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

It includes user authentication, notes CRUD, owner-based access control, soft delete, archive functionality, MongoDB aggregation analytics, and full-text search API.

---

## Project Modules

This backend contains 3 main projects:

### Project 1: Notes App Backend

- User and notes collections
- Each note is connected to a user using reference
- CRUD operations for notes
- Only the note owner can access their notes
- Mongoose populate to fetch user details with notes
- List all notes of logged-in user
- Get a single note
- Soft delete and archive option for notes

### Project 2: Data Analytics API

- Uses MongoDB aggregation pipeline
- Calculates note summaries
- Counts total notes, archived notes, and active notes
- Counts notes by category
- Shows notes created per month
- Supports filtering by user, category, and date range
- Uses `$match`, `$group`, `$project`, and `$sort`

### Project 3: Text Search API

- Uses MongoDB full-text search
- Searches notes by title, content, category, and tags
- Creates text index on searchable fields
- Provides `/api/search` endpoint
- Returns matching documents sorted by relevance
- Supports filters like category, tag, and date range

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- Nodemon

---

## Folder Structure

```bash
notes-app-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── noteController.js
│   ├── analyticsController.js
│   └── searchController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   └── Note.js
│
├── routes/
│   ├── authRoutes.js
│   ├── noteRoutes.js
│   ├── analyticsRoutes.js
│   └── searchRoutes.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notes-app-backend.git
```

### 2. Go to Project Folder

```bash
cd notes-app-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create `.env` File

Create a `.env` file in the root folder and add the following:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notes_app
JWT_SECRET=your_secret_key
```

### 5. Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

Server will run on:

```bash
http://localhost:5000
```

---

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Server running port |
| MONGO_URI | MongoDB connection URL |
| JWT_SECRET | Secret key for JWT token |

---

## Authentication

This project uses JWT authentication.

After login, copy the token from the response and send it in protected routes using the Authorization header:

```http
Authorization: Bearer your_jwt_token
```

---

# Project 1: Notes App Backend

## Authentication Routes

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

Success Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John",
    "email": "john@example.com"
  }
}
```

---

### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John",
    "email": "john@example.com"
  }
}
```

---

## Notes Routes

All notes routes are protected.

### Create Note

```http
POST /api/notes
```

Request Body:

```json
{
  "title": "MongoDB Text Search",
  "content": "Learning full-text search in MongoDB",
  "category": "Database",
  "tags": ["mongodb", "search", "backend"]
}
```

Success Response:

```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "note_id",
    "title": "MongoDB Text Search",
    "content": "Learning full-text search in MongoDB",
    "category": "Database",
    "tags": ["mongodb", "search", "backend"],
    "user": "user_id",
    "isArchived": false,
    "isDeleted": false
  }
}
```

---

### Get All Notes of Logged-in User

```http
GET /api/notes
```

Success Response:

```json
{
  "success": true,
  "count": 1,
  "notes": [
    {
      "_id": "note_id",
      "title": "MongoDB Text Search",
      "content": "Learning full-text search in MongoDB",
      "category": "Database",
      "tags": ["mongodb", "search"],
      "user": {
        "_id": "user_id",
        "name": "John",
        "email": "john@example.com"
      },
      "isArchived": false,
      "isDeleted": false
    }
  ]
}
```

---

### Get Single Note

```http
GET /api/notes/:id
```

Example:

```http
GET /api/notes/65f123abc456def789000111
```

---

### Update Note

```http
PUT /api/notes/:id
```

Request Body:

```json
{
  "title": "Updated Note",
  "content": "This note has been updated",
  "category": "Backend",
  "tags": ["node", "express"]
}
```

---

### Archive or Unarchive Note

```http
PATCH /api/notes/:id/archive
```

This endpoint changes the note archive status.

If the note is not archived, it will archive it.  
If the note is already archived, it will unarchive it.

Success Response:

```json
{
  "success": true,
  "message": "Note archived successfully",
  "note": {
    "_id": "note_id",
    "title": "MongoDB Text Search",
    "isArchived": true,
    "isDeleted": false
  }
}
```

---

### Get Archived Notes

```http
GET /api/notes/archived
```

---

### Get User with Notes

```http
GET /api/notes/user-with-notes
```

Success Response:

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John",
    "email": "john@example.com"
  },
  "notes": [
    {
      "_id": "note_id",
      "title": "MongoDB Text Search",
      "content": "Learning full-text search in MongoDB",
      "user": "user_id",
      "isArchived": false,
      "isDeleted": false
    }
  ]
}
```

---

### Soft Delete Note

```http
DELETE /api/notes/:id
```

Success Response:

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

This endpoint does not permanently delete the note from MongoDB.  
It only updates the note like this:

```json
{
  "isDeleted": true
}
```

---

## Notes API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | Get all notes of logged-in user |
| GET | `/api/notes/:id` | Get a single note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Soft delete a note |
| PATCH | `/api/notes/:id/archive` | Archive or unarchive note |
| GET | `/api/notes/archived` | Get archived notes |
| GET | `/api/notes/user-with-notes` | Get user with notes |

---

# Project 2: Data Analytics API

The analytics API uses MongoDB aggregation pipeline to calculate summaries and grouped results.

All analytics routes are protected.

---

## Get Notes Analytics Summary

```http
GET /api/analytics/summary
```

Example Response:

```json
{
  "success": true,
  "filters": {
    "category": "All",
    "startDate": null,
    "endDate": null
  },
  "analytics": {
    "totalNotes": 5,
    "archivedNotes": 2,
    "activeNotes": 3
  }
}
```

---

## Get Analytics Summary with Category Filter

```http
GET /api/analytics/summary?category=Database
```

---

## Get Analytics Summary with Date Range

```http
GET /api/analytics/summary?startDate=2026-05-01&endDate=2026-05-31
```

---

## Get Notes Count by Category

```http
GET /api/analytics/notes-by-category
```

Example Response:

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "totalNotes": 4,
      "category": "Database"
    },
    {
      "totalNotes": 2,
      "category": "Backend"
    },
    {
      "totalNotes": 1,
      "category": "General"
    }
  ]
}
```

---

## Get Notes Count by Category with Date Range

```http
GET /api/analytics/notes-by-category?startDate=2026-05-01&endDate=2026-05-31
```

---

## Get Notes Created Per Month

```http
GET /api/analytics/notes-by-month
```

Example Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "totalNotes": 3,
      "year": 2026,
      "month": 4
    },
    {
      "totalNotes": 5,
      "year": 2026,
      "month": 5
    }
  ]
}
```

---

## Analytics API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/summary` | Get total, active, and archived notes |
| GET | `/api/analytics/summary?category=Database` | Get summary by category |
| GET | `/api/analytics/summary?startDate=2026-05-01&endDate=2026-05-31` | Get summary by date range |
| GET | `/api/analytics/notes-by-category` | Get notes count per category |
| GET | `/api/analytics/notes-by-category?startDate=2026-05-01&endDate=2026-05-31` | Get category count by date range |
| GET | `/api/analytics/notes-by-month` | Get notes created per month |

---

## MongoDB Aggregation Concepts Used

### `$match`

Used to filter documents before grouping.

```js
{
  $match: {
    user: userId,
    isDeleted: false
  }
}
```

### `$group`

Used to group documents and calculate totals.

```js
{
  $group: {
    _id: "$category",
    totalNotes: { $sum: 1 }
  }
}
```

### `$project`

Used to format the final output.

```js
{
  $project: {
    _id: 0,
    category: "$_id",
    totalNotes: 1
  }
}
```

### `$sort`

Used to sort the result.

```js
{
  $sort: {
    totalNotes: -1
  }
}
```

---

# Project 3: Text Search API

The search API allows users to search notes by text.

It uses MongoDB full-text search with `$text`.

All search routes are protected.

---

## Searchable Fields

The following fields are searchable:

- title
- content
- category
- tags

A text index is created on these fields:

```js
noteSchema.index({
  title: "text",
  content: "text",
  category: "text",
  tags: "text"
});
```

---

## Search Notes

```http
GET /api/search?q=mongodb
```

Full URL:

```http
http://localhost:5000/api/search?q=mongodb
```

Example Response:

```json
{
  "success": true,
  "query": "mongodb",
  "count": 2,
  "notes": [
    {
      "_id": "note_id",
      "title": "MongoDB Text Search",
      "content": "Using text index and text search in MongoDB",
      "category": "Database",
      "tags": ["mongodb", "search"],
      "user": {
        "_id": "user_id",
        "name": "John",
        "email": "john@example.com"
      },
      "isArchived": false,
      "isDeleted": false,
      "score": 1.5
    }
  ]
}
```

---

## Search Notes with Category Filter

```http
GET /api/search?q=mongodb&category=Database
```

---

## Search Notes with Tag Filter

```http
GET /api/search?q=mongodb&tag=search
```

---

## Search Notes with Date Range

```http
GET /api/search?q=mongodb&startDate=2026-05-01&endDate=2026-05-31
```

---

## Search Notes with Multiple Filters

```http
GET /api/search?q=mongodb&category=Database&tag=search&startDate=2026-05-01&endDate=2026-05-31
```

---

## Search API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=mongodb` | Search notes by keyword |
| GET | `/api/search?q=mongodb&category=Database` | Search with category filter |
| GET | `/api/search?q=mongodb&tag=search` | Search with tag filter |
| GET | `/api/search?q=mongodb&startDate=2026-05-01&endDate=2026-05-31` | Search with date range |
| GET | `/api/search?q=mongodb&category=Database&tag=search` | Search with multiple filters |

---

## MongoDB Text Search Concepts Used

### Text Index

A text index allows MongoDB to search string content efficiently.

```js
noteSchema.index({
  title: "text",
  content: "text",
  category: "text",
  tags: "text"
});
```

### `$text`

The `$text` operator searches inside the indexed fields.

```js
{
  $text: {
    $search: q
  }
}
```

### Text Score

MongoDB returns a relevance score for matching documents.

```js
{
  score: {
    $meta: "textScore"
  }
}
```

### Sort by Relevance

Results are sorted by the best matching notes first.

```js
.sort({
  score: {
    $meta: "textScore"
  }
})
```

---

# Main Models

## User Model

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
```

---

## Note Model

```js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Content is required"]
    },
    category: {
      type: String,
      default: "General",
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

noteSchema.index({
  title: "text",
  content: "text",
  category: "text",
  tags: "text"
});

module.exports = mongoose.model("Note", noteSchema);
```

---

# Important Project Logic

## User and Note Relationship

Each note belongs to one user using MongoDB reference.

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

---

## Owner-Based Access Control

When fetching, updating, deleting, archiving, searching, or analysing notes, the API checks the logged-in user ID.

Example:

```js
{
  _id: req.params.id,
  user: req.user._id,
  isDeleted: false
}
```

This ensures one user cannot access another user’s notes.

---

## Mongoose Populate

This project uses `populate()` to fetch user details with notes.

Example:

```js
const notes = await Note.find({
  user: req.user._id,
  isDeleted: false
}).populate("user", "name email");
```

---

## Soft Delete

Instead of permanently deleting notes, the project uses soft delete.

The note model contains:

```js
isDeleted: {
  type: Boolean,
  default: false
}
```

When a note is deleted:

```js
isDeleted: true
```

Normal note listing only shows:

```js
isDeleted: false
```

---

## Archive Feature

The note model contains:

```js
isArchived: {
  type: Boolean,
  default: false
}
```

A note can be archived or unarchived using:

```http
PATCH /api/notes/:id/archive
```

---

# Postman Testing Guide

## Step 1: Register User

```http
POST http://localhost:5000/api/auth/register
```

Body:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Step 2: Login User

```http
POST http://localhost:5000/api/auth/login
```

Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Copy the token from the response.

---

## Step 3: Save Token in Postman Environment

In Postman, go to Login request:

```text
Scripts > Post-response
```

Paste this script:

```js
const response = pm.response.json();

if (response.token) {
    pm.environment.set("auth_token", response.token);
    console.log("Token saved successfully:", response.token);
} else {
    console.log("Token not found in response");
}
```

---

## Step 4: Use Token in Protected Routes

In protected requests, go to Authorization tab:

```text
Type: Bearer Token
Token: {{auth_token}}
```

Or add it manually in Headers:

```http
Authorization: Bearer {{auth_token}}
```

---

## Step 5: Create Sample Notes

```http
POST http://localhost:5000/api/notes
```

Body:

```json
{
  "title": "MongoDB Aggregation",
  "content": "Learning aggregation pipeline with group and project stages",
  "category": "Database",
  "tags": ["mongodb", "analytics"]
}
```

Another sample:

```json
{
  "title": "Express Authentication",
  "content": "Learning JWT authentication and protected routes",
  "category": "Backend",
  "tags": ["express", "jwt", "auth"]
}
```

Another sample:

```json
{
  "title": "MongoDB Text Search",
  "content": "Using text index and text search in MongoDB",
  "category": "Database",
  "tags": ["mongodb", "search"]
}
```

---

# Status Codes Used

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Created successfully |
| 400 | Bad request or missing fields |
| 401 | Unauthorized or invalid token |
| 404 | Data not found |
| 409 | User already exists |
| 500 | Server error |

---

# Example Error Response

```json
{
  "success": false,
  "message": "Note not found or access denied"
}
```

---

# Future Improvements

- Add pagination for notes
- Add restore deleted note feature
- Add permanent delete option
- Add note priority
- Add reminder date for notes
- Add refresh token support
- Add regex-based search fallback
- Add analytics charts on frontend
- Add export analytics report
- Add multiple tag filtering
- Add role-based access control

---

# Author

Vikas Kushwaha

---

# License

This project is open-source and created for learning and practice purposes.