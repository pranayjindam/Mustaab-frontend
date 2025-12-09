// src/admin/pages/UsersPage.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import UserForm from "./userForm";

export default function UsersPage() {
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const users = data?.users || [];

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const openForm = (user = null) => {
    setEditUser(user);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      if (deleteUser?.unwrap) {
        await deleteUser(id).unwrap();
      } else {
        await deleteUser(id);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete user");
    }
  };

  if (isLoading)
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );

  if (isError)
    return (
      <div className="p-6">
        <p className="text-red-600">Error loading users.</p>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Users Management</h1>
        <button
          onClick={() => openForm(null)}
          className="px-3 py-1 bg-gray-900 text-white text-sm rounded"
        >
          Add User
        </button>
      </div>

      <div className="overflow-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.mobile || "—"}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openForm(user)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                        aria-label={`Edit ${user.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-60"
                        aria-label={`Delete ${user.name}`}
                        disabled={isDeleting}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <UserForm
          user={editUser}
          onClose={() => {
            setIsOpen(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}
