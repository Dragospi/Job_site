import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/notifications/${user._id}`)
        .then((res) => {
          setNotifications(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  const markAsRead = (id) => {
    axios
      .put(`http://localhost:5000/api/notifications/${id}/read`)
      .then(() => {
        setNotifications(
          notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={notification.isRead ? "read" : "unread"}
              onClick={() => markAsRead(notification._id)}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;