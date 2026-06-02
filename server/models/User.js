const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    displayName: {
      type: String,
      default: "",
    },

    photoURL: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "employee",
    },

    organisationName: {
      type: String,
      default: "",
    },

    employeeId: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    themePreference: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
