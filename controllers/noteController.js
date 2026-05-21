const Note = require("../models/Note");
const User = require("../models/User");

// Create Note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get My Notes
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isDeleted: false
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
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

// Get Single Note
const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    }).populate("user", "name email");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or access denied"
      });
    }

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or access denied"
      });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Soft Delete Note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or access denied"
      });
    }

    note.isDeleted = true;
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Archive / Unarchive Note
const archiveNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or access denied"
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      message: note.isArchived
        ? "Note archived successfully"
        : "Note unarchived successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get Archived Notes
const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isArchived: true,
      isDeleted: false
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
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

// Get User With Notes
const getUserWithNotes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const notes = await Note.find({
      user: req.user._id,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      user,
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
  createNote,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  archiveNote,
  getArchivedNotes,
  getUserWithNotes
};