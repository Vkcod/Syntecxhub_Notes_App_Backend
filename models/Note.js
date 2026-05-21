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

// Text index for search
noteSchema.index({
  title: "text",
  content: "text",
  category: "text",
  tags: "text"
});

module.exports = mongoose.model("Note", noteSchema);