const Attendance = require("../models/Attendance");
const ExcelJS = require("exceljs");

/*
|--------------------------------------------------------------------------
| Clock In
|--------------------------------------------------------------------------
*/
exports.clockIn = async (req, res) => {
  try {
    const { uid, email, displayName } = req.user;

    const { locationType, narration } = req.body;

    const today = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({
      uid,
      date: today,
    });

    if (record?.inTime) {
      return res.status(400).json({
        message: "Already clocked in today",
      });
    }

    record = await Attendance.findOneAndUpdate(
      {
        uid,
        date: today,
      },
      {
        $set: {
          uid,
          email,
          displayName,

          inTime: new Date(),

          locationType: locationType || "in-office",

          narration: narration || "",

          status: "present",
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      message: "Clocked in successfully",
      record,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Clock Out
|--------------------------------------------------------------------------
*/
exports.clockOut = async (req, res) => {
  try {
    const { uid } = req.user;

    const { narration } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      uid,
      date: today,
    });

    if (!record || !record.inTime) {
      return res.status(400).json({
        message: "You have not clocked in today",
      });
    }

    if (record.outTime) {
      return res.status(400).json({
        message: "Already clocked out today",
      });
    }

    const outTime = new Date();

    const totalHours = (outTime - new Date(record.inTime)) / (1000 * 60 * 60);

    const updated = await Attendance.findOneAndUpdate(
      {
        uid,
        date: today,
      },
      {
        $set: {
          outTime,
          totalHours: parseFloat(totalHours.toFixed(2)),

          narration: narration || record.narration,
        },
      },
      {
        new: true,
      },
    );

    res.json({
      message: "Clocked out successfully",
      record: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Today's Attendance
|--------------------------------------------------------------------------
*/
exports.getToday = async (req, res) => {
  try {
    const { uid } = req.user;

    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      uid,
      date: today,
    });

    res.json({
      record: record || null,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Attendance By Month
|--------------------------------------------------------------------------
*/
exports.getByMonth = async (req, res) => {
  try {
    const { uid } = req.user;

    const { year, month } = req.query;

    const start = `${year}-${String(month).padStart(2, "0")}-01`;

    const end = `${year}-${String(month).padStart(2, "0")}-31`;

    const records = await Attendance.find({
      uid,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      date: 1,
    });

    res.json({
      records,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| All Attendance
|--------------------------------------------------------------------------
*/
exports.getAll = async (req, res) => {
  try {
    const { uid } = req.user;

    const { page = 1, limit = 30 } = req.query;

    const skip = (page - 1) * parseInt(limit);

    const records = await Attendance.find({
      uid,
    })
      .sort({
        date: -1,
      })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments({
      uid,
    });

    res.json({
      records,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Attendance By ID
|--------------------------------------------------------------------------
*/
exports.getAttendanceById = async (req, res) => {
  try {
    const { uid } = req.user;

    const { id } = req.params;

    const attendance = await Attendance.findOne({
      _id: id,
      uid,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.json(attendance);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
*/
exports.updateAttendance = async (req, res) => {
  try {
    const { uid } = req.user;

    const { id } = req.params;

    const { inTime, outTime, narration, status, locationType } = req.body;

    const attendance = await Attendance.findOne({
      _id: id,
      uid,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    if (inTime) {
      attendance.inTime = new Date(inTime);
    }

    if (outTime) {
      attendance.outTime = new Date(outTime);
    }

    if (narration !== undefined) {
      attendance.narration = narration;
    }

    if (status) {
      attendance.status = status;
    }

    if (
      locationType &&
      ["in-office", "outside-office", "remote"].includes(locationType)
    ) {
      attendance.locationType = locationType;
    }

    if (attendance.inTime && attendance.outTime) {
      const hours =
        (new Date(attendance.outTime) - new Date(attendance.inTime)) /
        (1000 * 60 * 60);

      attendance.totalHours = parseFloat(hours.toFixed(2));
    }

    await attendance.save();

    res.json({
      message: "Attendance updated successfully",
      record: attendance,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/
exports.deleteAttendance = async (req, res) => {
  try {
    const { uid } = req.user;

    const { id } = req.params;

    const deleted = await Attendance.findOneAndDelete({
      _id: id,
      uid,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.json({
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Export Excel
|--------------------------------------------------------------------------
*/
exports.exportExcel = async (req, res) => {
  try {
    const { uid } = req.user;

    const records = await Attendance.find({
      uid,
    }).sort({
      date: -1,
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      {
        header: "Date",
        key: "date",
        width: 15,
      },
      {
        header: "In Time",
        key: "inTime",
        width: 25,
      },
      {
        header: "Out Time",
        key: "outTime",
        width: 25,
      },
      {
        header: "Total Hours",
        key: "totalHours",
        width: 15,
      },
      {
        header: "Narration",
        key: "narration",
        width: 50,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
      {
        header: "Location",
        key: "locationType",
        width: 20,
      },
    ];

    worksheet.getRow(1).font = {
      bold: true,
    };

    records.forEach((record) => {
      worksheet.addRow({
        date: record.date,

        inTime: record.inTime ? new Date(record.inTime).toLocaleString() : "",

        outTime: record.outTime
          ? new Date(record.outTime).toLocaleString()
          : "",

        totalHours: record.totalHours,

        narration: record.narration || "",

        status: record.status,

        locationType: record.locationType,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="attendance-report.xlsx"',
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
