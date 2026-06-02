import React, { useState, useEffect, useCallback } from "react";

import { format, addMonths, subMonths } from "date-fns";

import api from "../utils/api";
import toast from "react-hot-toast";
import EditAttendanceModal from "./EditAttendanceModal";

const fmt = (d) => (d ? format(new Date(d), "hh:mm a") : "—");

const fmtDate = (d) => format(new Date(d), "EEE, MMM d");

const fmtHours = (h) => (h ? `${h}h` : "—");

const LocationBadge = ({ type }) => {
  const map = {
    "in-office": {
      label: "🏢 In Office",
      cls: "in-office",
    },
    "outside-office": {
      label: "🌍 Outside",
      cls: "outside",
    },
    remote: {
      label: "🏠 Remote",
      cls: "remote",
    },
  };

  const t = map[type] || map["in-office"];

  return <span className={`badge ${t.cls}`}>{t.label}</span>;
};

const StatusBadge = ({ status }) => {
  const map = {
    present: {
      label: "✓ Present",
      cls: "present",
    },
    absent: {
      label: "✗ Absent",
      cls: "absent",
    },
    "half-day": {
      label: "½ Half Day",
      cls: "half-day",
    },
    leave: {
      label: "🏖 Leave",
      cls: "leave",
    },
  };

  const t = map[status] || map.present;

  return <span className={`badge ${t.cls}`}>{t.label}</span>;
};

export default function AttendanceTable({ refresh }) {
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const year = currentMonth.getFullYear();

      const month = currentMonth.getMonth() + 1;

      const { data } = await api.get(
        `/attendance/month?year=${year}&month=${month}`,
      );

      setRecords(data.records || []);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, refresh]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this attendance record?");

    if (!confirmed) return;

    try {
      await api.delete(`/attendance/${id}`);

      toast.success("Attendance deleted");

      fetchRecords();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const exportExcel = () => {
    window.open("/api/attendance/export/excel", "_blank");
  };

  const totalPresent = records.filter((r) => r.status === "present").length;

  const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Attendance Log</h2>

            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              {totalPresent} days present · {totalHours.toFixed(1)}h total
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <button className="btn-primary" onClick={exportExcel}>
              📊 Export Excel
            </button>

            <div className="month-nav">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                ‹
              </button>

              <span>{format(currentMonth, "MMMM yyyy")}</span>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records for this month.</p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Hours</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Narration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td>{fmtDate(rec.date + "T12:00:00")}</td>

                    <td>{fmt(rec.inTime)}</td>

                    <td>{fmt(rec.outTime)}</td>

                    <td>{fmtHours(rec.totalHours)}</td>

                    <td>
                      <LocationBadge type={rec.locationType} />
                    </td>

                    <td>
                      <StatusBadge status={rec.status} />
                    </td>

                    <td
                      style={{
                        maxWidth: "250px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {rec.narration || "—"}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="btn-edit"
                          onClick={() => setEditingRecord(rec)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(rec._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingRecord && (
        <EditAttendanceModal
          attendance={editingRecord}
          onClose={() => setEditingRecord(null)}
          onUpdated={fetchRecords}
        />
      )}
    </>
  );
}
