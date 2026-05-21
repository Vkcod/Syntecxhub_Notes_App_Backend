const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotesAnalytics,
  getNotesByCategory,
  getNotesByMonth
} = require("../controllers/analyticsController");

router.get("/summary", protect, getNotesAnalytics);
router.get("/notes-by-category", protect, getNotesByCategory);
router.get("/notes-by-month", protect, getNotesByMonth);

module.exports = router;