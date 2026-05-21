const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { searchNotes } = require("../controllers/searchController");

router.get("/", protect, searchNotes);

module.exports = router;