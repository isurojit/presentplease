import React, { useEffect, useState } from "react";

import api from "../utils/api";
import toast from "react-hot-toast";

export default function ProfileModal({ onClose, onSaved }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    organisationName: "",
    employeeId: "",
    designation: "",
    department: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/user/profile");

      if (data.user) {
        setForm({
          displayName: data.user?.displayName ?? "",

          organisationName: data.user?.organisationName ?? "",

          employeeId: data.user?.employeeId ?? "",

          designation: data.user?.designation ?? "",

          department: data.user?.department ?? "",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to load profile");
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      await api.put("/user/profile", form);

      toast.success("Profile updated successfully");

      // Refresh Dashboard Profile Card
      onSaved?.();

      onClose();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="profile-modal">
        <div className="modal-header">
          <h2>Profile Settings</h2>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm({
                  ...form,
                  displayName: e.target.value,
                })
              }
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Organisation Name</label>

            <input
              type="text"
              value={form.organisationName}
              onChange={(e) =>
                setForm({
                  ...form,
                  organisationName: e.target.value,
                })
              }
              placeholder="Enter organisation name"
            />
          </div>

          <div className="form-group">
            <label>Employee ID</label>

            <input
              type="text"
              value={form.employeeId}
              onChange={(e) =>
                setForm({
                  ...form,
                  employeeId: e.target.value,
                })
              }
              placeholder="Enter employee ID"
            />
          </div>

          <div className="form-group">
            <label>Designation</label>

            <input
              type="text"
              value={form.designation}
              onChange={(e) =>
                setForm({
                  ...form,
                  designation: e.target.value,
                })
              }
              placeholder="Enter designation"
            />
          </div>

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
              placeholder="Enter department"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={saveProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
