# Notes App Backend

A simple backend API for a Notes App built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

This project includes user authentication, note CRUD operations, owner-based access control, Mongoose references, populate, soft delete, and archive functionality.

---

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Create, read, update, and delete notes
- Each note is connected to a user using MongoDB reference
- Only the note owner can access, update, delete, or archive their notes
- List all notes of the logged-in user
- Get a single note by ID
- Archive and unarchive notes
- Soft delete notes instead of permanently deleting them
- Use Mongoose populate to fetch user details with notes

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
│   └── noteController.js
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
│   └── noteRoutes.js
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

## API Endpoints

---

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
You must send the JWT token in the Authorization header.

```http
Authorization: Bearer your_jwt_token
```

---

### Create Note

```http
POST /api/notes
```

Request Body:

```json
{
  "title": "First Note",
  "content": "This is my first note"
}
```

Success Response:

```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "note_id",
    "title": "First Note",
    "content": "This is my first note",
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
      "title": "First Note",
      "content": "This is my first note",
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

Success Response:

```json
{
  "success": true,
  "note": {
    "_id": "note_id",
    "title": "First Note",
    "content": "This is my first note",
    "user": {
      "_id": "user_id",
      "name": "John",
      "email": "john@example.com"
    },
    "isArchived": false,
    "isDeleted": false
  }
}
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
  "content": "This note has been updated"
}
```

Success Response:

```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "_id": "note_id",
    "title": "Updated Note",
    "content": "This note has been updated",
    "isArchived": false,
    "isDeleted": false
  }
}
```

---

### Archive or Unarchive Note

```http
PATCH /api/notes/:id/archive
```

Success Response:

```json
{
  "success": true,
  "message": "Note archived successfully",
  "note": {
    "_id": "note_id",
    "title": "First Note",
    "content": "This is my first note",
    "isArchived": true,
    "isDeleted": false
  }
}
```

If the note is already archived, calling the same endpoint again will unarchive it.

---

### Get Archived Notes

```http
GET /api/notes/archived
```

Success Response:

```json
{
  "success": true,
  "count": 1,
  "notes": [
    {
      "_id": "note_id",
      "title": "First Note",
      "content": "This is my first note",
      "isArchived": true,
      "isDeleted": false
    }
  ]
}
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
      "title": "First Note",
      "content": "This is my first note",
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

This endpoint does not permanently delete the note from the database.  
It only updates the note like this:

```json
{
  "isDeleted": true
}
```

---

## Authentication Flow

1. User registers using name, email, and password.
2. Password is hashed using bcrypt before saving.
3. User logs in with email and password.
4. Server returns a JWT token.
5. User sends the token in the Authorization header.
6. Protected routes verify the token before allowing access.

---

## Note Ownership Logic

Each note is connected with a user through this field:

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

When a user creates a note, the logged-in user ID is saved with the note.

Example:

```js
const note = await Note.create({
  title,
  content,
  user: req.user._id
});
```

When fetching, updating, deleting, or archiving a note, the API checks both:

```js
_id: req.params.id,
user: req.user._id
```

This makes sure one user cannot access another user’s notes.

---

## Mongoose Populate

This project uses Mongoose `populate()` to fetch user details with notes.

Example:

```js
const notes = await Note.find({
  user: req.user._id,
  isDeleted: false
}).populate("user", "name email");
```

This returns note details with selected user information.

---

## Soft Delete Feature

Instead of permanently deleting notes, this project uses soft delete.

The note model contains:

```js
isDeleted: {
  type: Boolean,
  default: false
}
```

When a note is deleted, it is updated to:

```js
isDeleted: true
```

Normal note listing only shows notes where:

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

A user can archive or unarchive a note using:

```http
PATCH /api/notes/:id/archive
```

Archived notes can be fetched separately using:

```http
GET /api/notes/archived
```

---

## Status Codes Used

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

## Example Error Response

```json
{
  "success": false,
  "message": "Note not found or access denied"
}
```

---

## Testing with Postman

1. Start the server.
2. Register a new user.
3. Login with the user email and password.
4. Copy the JWT token from login response.
5. In Postman, go to the Authorization tab.
6. Select Bearer Token.
7. Paste the token.
8. Test the protected notes endpoints.

---

## Future Improvements

- Add note categories or tags
- Add search notes feature
- Add pagination
- Add restore deleted note feature
- Add permanent delete option
- Add note priority
- Add reminder date for notes
- Add refresh token support

---

## Author

John Kushwaha

---

## License

This project is open-source and created for learning and practice purposes.