import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../redux/api/userApi";

export default function UserForm({ user, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "USER",
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        role: user.role || "USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: user._id, ...form }).unwrap();
      onClose();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-md p-5 w-full max-w-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded text-sm"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border p-2 rounded text-sm"
            required
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="w-full border p-2 rounded text-sm"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
