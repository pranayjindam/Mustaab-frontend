import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../../redux/slices/notificationSlice";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:2000");

export default function AdminNavbar() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  
  const [open, setOpen] = useState(false); // 🔹 dropdown state

  useEffect(() => {
    socket.on("connect", () => console.log("Admin socket connected"));

    socket.on("adminNotification", (notif) => {
      dispatch(addNotification(notif));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <div className="relative flex items-center gap-4">
      {/* Bell Icon */}
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen((prev) => !prev)} // 🔹 toggle on click
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 6 15h12a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6zM5 18a3 3 0 0 0 6 0H5z" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && notifications.length > 0 && (
        <div className="absolute right-0 mt-8 w-80 bg-white shadow-lg border rounded-lg max-h-96 overflow-y-auto z-50">
          {notifications.map((n, i) => (
            <div key={i} className="p-3 border-b hover:bg-gray-50">
              <p className="font-medium">{n.type}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400">{new Date(n.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
