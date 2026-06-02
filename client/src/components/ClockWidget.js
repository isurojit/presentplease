import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../utils/api";
import toast from "react-hot-toast";

const fmt = (d) => (d ? format(new Date(d), "hh:mm a") : "—");

export default function ClockWidget({ onAttendanceChange }) {
  const [time, setTime] = useState(new Date());

  const [record, setRecord] = useState(null);

  const [locationType, setLocationType] = useState("in-office");

  const [narration, setNarration] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const { data } = await api.get("/attendance/today");

      setRecord(data.record);

      if (data.record?.narration) {
        setNarration(data.record.narration);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setActionLoading(true);

    try {
      const { data } = await api.post("/attendance/clock-in", {
        locationType,
        narration,
      });

      setRecord(data.record);

      toast.success("Clocked in successfully! ✅");

      onAttendanceChange?.();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to clock in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);

    try {
      const { data } = await api.post("/attendance/clock-out", {
        narration,
      });

      setRecord(data.record);

      toast.success("Clocked out! Have a great day 👋");

      onAttendanceChange?.();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to clock out");
    } finally {
      setActionLoading(false);
    }
  };

  const locationLabel = {
    "in-office": "🏢 In Office",
    "outside-office": "🌍 Outside Office",
    remote: "🏠 Remote",
  };

  if (loading) {
    return (
      <div className="clock-card">
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const canClockIn = !record?.inTime;

  const canClockOut = record?.inTime && !record?.outTime;

  return (
    <div className="clock-card">
      <div className="clock-display">
        {format(time, "hh:mm:ss")}

        <span
          style={{
            fontSize: "1.5rem",
            color: "var(--text-secondary)",
            marginLeft: "8px",
          }}
        >
          {format(time, "a")}
        </span>
      </div>

      <div className="clock-date">{format(time, "EEEE, MMMM d, yyyy")}</div>

      {/* Narration */}

      <div className="narration-section">
        <label>Today's Work Narration</label>

        <textarea
          className="narration-input"
          rows="4"
          placeholder="Worked on attendance module...
Fixed calendar bugs...
Client discussion...
"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </div>

      <div className="clock-actions">
        {canClockIn && (
          <select
            className="location-select"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            <option value="in-office">🏢 In Office</option>

            <option value="outside-office">🌍 Outside Office</option>

            <option value="remote">🏠 Remote</option>
          </select>
        )}

        <button
          className="btn-clock-in"
          onClick={handleClockIn}
          disabled={!canClockIn || actionLoading}
        >
          ⏩ Clock In
        </button>

        <button
          className="btn-clock-out"
          onClick={handleClockOut}
          disabled={!canClockOut || actionLoading}
        >
          ⏹ Clock Out
        </button>
      </div>

      <div className="today-status">
        <div className="status-item">
          <div className="status-icon teal">🕐</div>

          <div>
            <div className="status-label">In Time</div>

            <div className="status-value">{fmt(record?.inTime)}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon orange">🕔</div>

          <div>
            <div className="status-label">Out Time</div>

            <div className="status-value">{fmt(record?.outTime)}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon purple">⏱</div>

          <div>
            <div className="status-label">Hours</div>

            <div className="status-value">
              {record?.totalHours
                ? `${record.totalHours}h`
                : record?.inTime && !record?.outTime
                  ? "Active"
                  : "—"}
            </div>
          </div>
        </div>

        {record?.locationType && (
          <div className="status-item">
            <div className="status-icon teal">📍</div>

            <div>
              <div className="status-label">Location</div>

              <div className="status-value">
                {locationLabel[record.locationType]}
              </div>
            </div>
          </div>
        )}
      </div>

      {record?.narration && (
        <div className="narration-view">
          <div className="narration-title">Today's Notes</div>

          <div className="narration-text">{record.narration}</div>
        </div>
      )}
    </div>
  );
}
