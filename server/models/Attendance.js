const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

    inTime: {
      type: Date,
      default: null,
    },

    outTime: {
      type: Date,
      default: null,
    },

    narration: {
      type: String,
      default: "",
    },

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["present", "absent", "half-day", "leave"],
      default: "present",
    },

    locationType: {
      type: String,
      enum: ["in-office", "outside-office", "remote"],
      default: "in-office",
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ uid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
