import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null); // which field is being edited
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Please log in to view your profile.");
          setLoading(false);
          return;
        }
        const { data } = await axios.get(
"https://mustaab.onrender.com/api/user/me",          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          setUser(data.user);
        } else {
          setMessage(data.message || "Failed to load profile.");
        }
      } catch (err) {
        setMessage("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle save for a single field
  const saveField = async (field) => {
    if (!tempValue.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        "https://mustaab.onrender.com/api/user/update",
        { [field]: tempValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setUser((prev) => ({ ...prev, [field]: tempValue }));
        setMessage("✅ Updated successfully.");
        setEditField(null);
      } else {
        setMessage("❌ Update failed.");
      }
    } catch (err) {
      setMessage("❌ Error updating field.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (!user)
    return <div className="text-center text-red-500">{message || "No user data"}</div>;

  const fields = [
    { key: "email", label: "Email", type: "email" },
    { key: "mobile", label: "Mobile", type: "text" },
    { key: "password", label: "Password", type: "password" },
    { key: "role", label: "Role", type: "text" },
  ];

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          My Profile
        </h2>

        {message && (
          <div className="mb-4 text-center text-sm text-blue-600">{message}</div>
        )}

        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.key} className="flex justify-between items-center">
              <div className="w-full">
                <p className="text-gray-500 text-sm">{field.label}</p>
                {editField === field.key ? (
                  <input
                    type={field.type}
                    className="w-full border px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-200"
                    placeholder={user[field.key]}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <p className="font-medium break-all">
                    {field.key === "password" ? "********" : user[field.key] || "-"}
                  </p>
                )}
              </div>
              <div className="ml-3">
                {editField === field.key ? (
                  <button
                    onClick={() => saveField(field.key)}
                    disabled={saving}
                    className="text-green-600 hover:underline text-sm"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditField(field.key);
                      setTempValue(user[field.key] || "");
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Joined date */}
          <div>
            <p className="text-gray-500 text-sm">Joined On</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
