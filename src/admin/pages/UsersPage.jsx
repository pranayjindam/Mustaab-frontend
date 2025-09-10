import React, { useState } from "react";
import {  
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from "../../redux/api/userApi";
import UserForm from "./userForm";

export default function UsersPage() {
  // const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const openForm = (user = null) => {
    setEditUser(user);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center border-b">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => openForm(user)}
                  className="bg-blue-600 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
