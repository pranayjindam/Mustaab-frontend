"use client";
import React, { useState, useEffect } from "react";
import { useGetProfileQuery, useUpdateUserMutation } from "../redux/api/userApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice.js";
import Loader from "../components/Loader.jsx";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const { data: userData, isLoading, isError } = useGetProfileQuery();
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");

  // Sync Redux auth.user with latest profile data
  useEffect(() => {
    if (userData?.user && auth.user?._id !== userData.user._id) {
      dispatch(setCredentials({ user: userData.user, token: auth.token }));
    }
  }, [userData, auth.token, auth.user, dispatch]);

  if (isLoading) return <Loader />;
  if (isError || !userData?.user)
    return <div className="text-center text-red-500">Failed to load profile.</div>;

  const user = userData.user;

  const fields = [
    { key: "email", label: "Email", type: "email" },
    { key: "mobile", label: "Mobile", type: "text" },
    { key: "password", label: "Password", type: "password" }
  ];

  const saveField = async (field) => {
    if (!tempValue.trim()) return;
    try {
      const res = await updateUser({ field, value: tempValue }).unwrap();
      if (res.success) {
        setMessage("✅ Updated successfully.");
        setEditField(null);

        // Update Redux auth.user as well
        dispatch(setCredentials({ user: { ...user, [field]: tempValue }, token: auth.token }));
      } else {
        setMessage("❌ Update failed.");
      }
    } catch (err) {
      setMessage("❌ Error updating field.");
    }
  };

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

          <div>
            <p className="text-gray-500 text-sm">Joined On</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
