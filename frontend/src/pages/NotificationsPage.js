import React, { useEffect, useState } from "react";
import axios from "axios";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/notifications/unread-count", {
        withCredentials: true,
      });
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Failed to load unread count", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/v1/notifications/read-all",
        {},
        { withCredentials: true }
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchNotifications();
      await fetchUnreadCount();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="notifications-shell">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-shell">
      <div className="notifications-container">
        {/* Header with Circle and Title */}
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">Stay updated with your latest activities</p>
          </div>
          
          {/* Circular Unread Count - Top Right */}
          <div className="unread-circle">
            <div className="unread-circle-icon">🔔</div>
            <div className="unread-circle-number">{unreadCount}</div>
            <div className="unread-circle-text">unread</div>
          </div>
        </div>

        {/* Mark All as Read Button Below Header */}
        <div className="mark-all-container">
          <button className="mark-all-button" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">No notifications available</p>
              <p className="empty-subtext">When you receive notifications, they'll appear here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${notification.readFlag ? 'read' : 'unread'}`}
              >
                <div className="card-content">
                  <div className="notification-icon">
                    {!notification.readFlag && <span className="unread-dot"></span>}
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 6L12 13L2 6M22 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6l10 7l10-7z" />
                    </svg>
                  </div>
                  
                  <div className="notification-details">
                    <div className="notification-header">
                      <h3 className="notification-title">{notification.title}</h3>
                      <span className="notification-type">{notification.type}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <span className="meta-text">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {!notification.readFlag && (
                    <button className="mark-read-button" onClick={() => markAsRead(notification.id)}>
                      <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .notifications-shell {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 40px 20px;
        }

        .notifications-container {
          max-width: 1000px;
          margin: 0 auto;
          padding:70px;
        }

        /* Loading Styles */
        .loading-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e5e7eb;
          border-top-color: #111827;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Header Styles */
        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .notifications-title {
          font-size: 3rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .notifications-subtitle {
          font-size: 1rem;
          color: #6b7280;
        }

        /* Circular Unread Count - Top Right */
        .unread-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          display: flex;
          margin-right:25px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
          animation: fadeInUp 0.5s ease;
        }

        .unread-circle:hover {
          transform: scale(1.05);
        }

        .unread-circle-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .unread-circle-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 2px;
        }

        .unread-circle-text {
          font-size: 0.6rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        /* Mark All Button Container */
        .mark-all-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }

        .mark-all-button {
          background: #111827;
          color: #ffffff;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .mark-all-button:hover {
          background: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Notifications List */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .notification-card {
          background: #ffffff;
          border-radius: 16px;
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .notification-card.unread {
          border-left: 4px solid #10b981;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .card-content {
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .notification-icon {
          position: relative;
          flex-shrink: 0;
        }

        .unread-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid #ffffff;
          animation: pulse 2s infinite;
        }

        .icon {
          width: 24px;
          height: 24px;
          color: #9ca3af;
        }

        .notification-details {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .notification-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .notification-type {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #f3f4f6;
          color: #4b5563;
        }

        .notification-message {
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .meta-text {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .mark-read-button {
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: #10b981;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mark-read-button:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .button-icon {
          width: 16px;
          height: 16px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .empty-subtext {
          font-size: 0.875rem;
          color: #9ca3af;
          margin: 0;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .notifications-container {
            padding: 0 16px;
          }
          
          .card-content {
            flex-direction: column;
          }
          
          .mark-read-button {
            align-self: flex-start;
          }
          
          .notifications-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .notifications-title {
            font-size: 2rem;
          }
          
          .unread-circle {
            align-self: flex-end;
            width: 80px;
            height: 80px;
          }
          
          .unread-circle-number {
            font-size: 1.5rem;
          }
          
          .unread-circle-icon {
            font-size: 1.2rem;
          }
          
          .mark-all-container {
            justify-content: stretch;
          }
          
          .mark-all-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default NotificationsPage;