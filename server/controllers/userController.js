const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      uid: req.user.uid,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, organisationName, employeeId, designation } = req.body;

    const user = await User.findOneAndUpdate(
      {
        uid: req.user.uid,
      },
      {
        displayName,
        organisationName,
        employeeId,
        designation,
      },
      {
        new: true,
      },
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
