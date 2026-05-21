const mongoose = require("mongoose");
const Note = require("../models/Note");

// Notes Analytics Summary
const getNotesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const matchStage = {
      user: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false
    };

    if (category) {
      matchStage.category = category;
    }

    if (startDate || endDate) {
      matchStage.createdAt = {};

      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    const analytics = await Note.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          archivedNotes: {
            $sum: {
              $cond: [{ $eq: ["$isArchived", true] }, 1, 0]
            }
          },
          activeNotes: {
            $sum: {
              $cond: [{ $eq: ["$isArchived", false] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalNotes: 1,
          archivedNotes: 1,
          activeNotes: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      filters: {
        category: category || "All",
        startDate: startDate || null,
        endDate: endDate || null
      },
      analytics: analytics[0] || {
        totalNotes: 0,
        archivedNotes: 0,
        activeNotes: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Notes Count Per Category
const getNotesByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      user: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};

      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    const result = await Note.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: "$category",
          totalNotes: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalNotes: 1
        }
      },
      {
        $sort: {
          totalNotes: -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Notes Created Per Month
const getNotesByMonth = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      user: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};

      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    const result = await Note.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalNotes: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalNotes: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
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
  getNotesAnalytics,
  getNotesByCategory,
  getNotesByMonth
};