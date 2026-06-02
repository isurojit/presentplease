const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  clockIn, clockOut, getToday, getByMonth, getAll
} = require('../controllers/attendanceController');

router.use(verifyToken);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/today', getToday);
router.get('/month', getByMonth);
router.get('/all', getAll);

module.exports = router;
