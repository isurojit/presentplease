const Attendance = require('../models/Attendance');

// Clock In
exports.clockIn = async (req, res) => {
  try {
    const { uid, email, displayName } = req.user;
    const { locationType, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let record = await Attendance.findOne({ uid, date: today });
    if (record && record.inTime) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }

    record = await Attendance.findOneAndUpdate(
      { uid, date: today },
      {
        $set: {
          uid, email, displayName,
          inTime: new Date(),
          locationType: locationType || 'in-office',
          notes: notes || '',
          status: 'present',
        }
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Clocked in successfully', record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clock Out
exports.clockOut = async (req, res) => {
  try {
    const { uid } = req.user;
    const { notes } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const record = await Attendance.findOne({ uid, date: today });
    if (!record || !record.inTime) {
      return res.status(400).json({ message: 'You have not clocked in today' });
    }
    if (record.outTime) {
      return res.status(400).json({ message: 'Already clocked out today' });
    }

    const outTime = new Date();
    const totalHours = (outTime - record.inTime) / (1000 * 60 * 60);

    const updated = await Attendance.findOneAndUpdate(
      { uid, date: today },
      { $set: { outTime, totalHours: parseFloat(totalHours.toFixed(2)), notes: notes || record.notes } },
      { new: true }
    );

    res.json({ message: 'Clocked out successfully', record: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get today's record
exports.getToday = async (req, res) => {
  try {
    const { uid } = req.user;
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ uid, date: today });
    res.json({ record: record || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get records by month
exports.getByMonth = async (req, res) => {
  try {
    const { uid } = req.user;
    const { year, month } = req.query;
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    const records = await Attendance.find({
      uid,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all records with pagination
exports.getAll = async (req, res) => {
  try {
    const { uid } = req.user;
    const { page = 1, limit = 30 } = req.query;
    const skip = (page - 1) * limit;

    const records = await Attendance.find({ uid })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments({ uid });

    res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
