const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const User = require("../models/User");

router.use(verifyToken);

/*
|--------------------------------------------------------------------------
| Sync User
|--------------------------------------------------------------------------
*/

router.post("/sync", async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.user;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          uid,
          email,
          displayName,
          photoURL,
          lastLogin: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({ user });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findOne({
      uid: req.user.uid,
    });

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

router.put("/profile", async (req, res) => {
  try {
    const {
      displayName,
      organisationName,
      employeeId,
      designation,
      department,
      themePreference,
    } = req.body;

    const user = await User.findOneAndUpdate(
      {
        uid: req.user.uid,
      },
      {
        $set: {
          displayName,
          organisationName,
          employeeId,
          designation,
          department,
          themePreference,
        },
      },
      {
        new: true,
      },
    );

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
