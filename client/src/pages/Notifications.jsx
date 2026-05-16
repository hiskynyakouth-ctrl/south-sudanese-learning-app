import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";

const TYPE_ICONS = { info: "ℹ️", success: "✅", warning: "⚠️", quiz: "📝", upload: "📤" };

export default function Notifications() {
  const navigate = useNavigate();
  const { getNotifications, markNotifRead, markAllNotifsRead, clearNotifications } = useProgress();
  const [notifs, setNotifs] = useState(() => getNotifications());

  const refresh = () => setNotifs(getNotifications());

  const handleRead = (id) => { markNotifRead(id); refresh(); };
  const handleReadAll = () => { markAllNotifsRead(); refresh(); };
  const handleClear = () => { if (window.confirm("Clear all notifications?")) { clearNotifications(); refresh(); } };

  const unread = notifs.filter(n => !n.read).length;

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="notif-shell">
      <div className="notif-header">
        <div>
          <h1>🔔 Notifications</h1>
          <p>{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {unread > 0 && (
            <button className="ghost-button" style={{ padding:"8px 16px", fontSize:"0.85rem" }}
              onClick={handleReadAll}>Mark all read</button>
          )}
          {notifs.length > 0 && (
            <button className="ghost-button" style={{ padding:"8px 16px", fontSize:"0.85rem", color:"#c62828" }}
              onClick={handleClear}>Clear all</button>
          )}
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="notif-empty">
          <span>🔔</span>
          <h3>No notifications yet</h3>
          <p>You'll see quiz results, uploads and updates here.</p>
          <button className="primary-button" style={{ padding:"12px 24px", marginTop:8 }}
            onClick={() => navigate("/streams/1")}>Start Learning →</button>
        </div>
      ) : (
        <div className="notif-list">
          {notifs.map(n => (
            <div key={n.id} className={`notif-item${n.read ? " read" : " unread"}`}
              onClick={() => handleRead(n.id)}>
              <span className="notif-icon">{TYPE_ICONS[n.type] || "🔔"}</span>
              <div className="notif-content">
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{formatTime(n.createdAt)}</span>
              </div>
              {!n.read && <div className="notif-dot" />}
            </div>
          ))}
        </div>
      )}

      <button className="ghost-button" style={{ justifySelf:"start", marginTop:8 }}
        onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
