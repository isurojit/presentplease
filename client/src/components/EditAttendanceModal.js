import React, { useEffect, useState } from "react";

import api from "../utils/api";
import toast from "react-hot-toast";

export default function EditAttendanceModal({
  attendance,
  onClose,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    inTime: "",
    outTime: "",
    narration: "",
    status: "present",
    locationType: "in-office",
  });

  useEffect(() => {
    if (!attendance) return;

    setForm({
      inTime: attendance.inTime
        ? new Date(attendance.inTime).toISOString().slice(0, 16)
        : "",

      outTime: attendance.outTime
        ? new Date(attendance.outTime).toISOString().slice(0, 16)
        : "",

      narration: attendance.narration || "",

      status: attendance.status || "present",

      locationType: attendance.locationType || "in-office",
    });
  }, [attendance]);

  const handleSave = async () => {
    try {
      setLoading(true);

      await api.put(`/attendance/${attendance._id}`, form);

      toast.success("Attendance updated successfully");

      onUpdated?.();

      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-attendance-modal">
        <div className="modal-header">
          <h2>Edit Attendance</h2>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>In Time</label>

            <input
              type="datetime-local"
              value={form.inTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  inTime: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Out Time</label>

            <input
              type="datetime-local"
              value={form.outTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  outTime: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="present">Present</option>

              <option value="absent">Absent</option>

              <option value="half-day">Half Day</option>

              <option value="leave">Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>

            <select
              value={form.locationType}
              onChange={(e) =>
                setForm({
                  ...form,
                  locationType: e.target.value,
                })
              }
            >
              <option value="in-office">🏢 In Office</option>

              <option value="outside-office">🌍 Outside Office</option>

              <option value="remote">🏠 Remote</option>
            </select>
          </div>

          <div className="form-group">
            <label>Narration</label>

            <textarea
              rows="5"
              value={form.narration}
              onChange={(e) =>
                setForm({
                  ...form,
                  narration: e.target.value,
                })
              }
              placeholder="Describe work completed..."
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
