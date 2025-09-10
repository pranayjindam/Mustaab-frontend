import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../redux/api/userApi";

export default function UserForm({ user, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "USER",
  });

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser({ id: user._id, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border w-full p-2"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="border w-full p-2"
            required
          />
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="border w-full p-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border w-full p-2"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
