const mongoose = require("mongoose");
const Note = require("../models/Note");

// Search Notes
const searchNotes = async (req, res) => {
  try {
    const { q, category, tag, startDate, endDate } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const filter = {
      user: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false,
      $text: {
        $search: q
      }
    };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const notes = await Note.find(
      filter,
      {
        score: {
          $meta: "textScore"
        }
      }
    )
      .sort({
        score: {
          $meta: "textScore"
        }
      })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      query: q,
      count: notes.length,
      notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  searchNotes
};