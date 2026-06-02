const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  clockIn,
  clockOut,
  getToday,
  getByMonth,
  getAll,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  exportExcel,
} = require("../controllers/attendanceController");

router.use(verifyToken);

// Clock Actions
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);

// Attendance Records
router.get("/today", getToday);
router.get("/month", getByMonth);
router.get("/all", getAll);

// Export
router.get("/export/excel", exportExcel);

// CRUD Operations
router.get("/:id", getAttendanceById);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
