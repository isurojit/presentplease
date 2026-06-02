import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function DashboardHero() {
  const [todayRecord, setTodayRecord] = useState(null);

  const [todoCount, setTodoCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const attendance = await api.get("/attendance/today");

      setTodayRecord(attendance.data.record);

      try {
        const todos = await api.get("/todos");

        const pending = todos.data.filter((t) => !t.completed).length;

        setTodoCount(pending);
      } catch {
        setTodoCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hourText = todayRecord?.totalHours
    ? `${todayRecord.totalHours} hrs`
    : todayRecord?.inTime
      ? "Active"
      : "0 hrs";

  return (
    <div className="dashboard-hero">
      <div className="hero-left">
        <h1>👋 Welcome Back</h1>

        <p>Manage attendance, tasks and productivity from one place.</p>
      </div>

      <div className="hero-stats">
        <div className="hero-stat-card">
          <span>✅</span>

          <div>
            <h3>Status</h3>

            <p>{todayRecord ? "Present" : "Not Marked"}</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <span>⏱</span>

          <div>
            <h3>Hours</h3>

            <p>{hourText}</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <span>📋</span>

          <div>
            <h3>Tasks</h3>

            <p>{todoCount} Pending</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <span>🎉</span>

          <div>
            <h3>Next Holiday</h3>

            <p>Independence Day</p>
          </div>
        </div>
      </div>
    </div>
  );
}
