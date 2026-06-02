const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Todo", todoSchema);
