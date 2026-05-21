const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createNote,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  archiveNote,
  getArchivedNotes,
  getUserWithNotes
} = require("../controllers/noteController");

router.post("/", protect, createNote);
router.get("/", protect, getMyNotes);
router.get("/archived", protect, getArchivedNotes);
router.get("/user-with-notes", protect, getUserWithNotes);
router.get("/:id", protect, getSingleNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.patch("/:id/archive", protect, archiveNote);

module.exports = router;