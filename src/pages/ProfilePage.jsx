import React, { useState, useEffect } from "react";
import { useGetProfileQuery, useUpdateUserMutation } from "../redux/api/userApi";
import AddressComponent from "../client/pages/checkout/AddressComponent";

export default function ProfilePage() {
  const { data: profile, isLoading: loadingProfile, refetch } = useGetProfileQuery();
  const [updateUser] = useUpdateUserMutation();

  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [savedField, setSavedField] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || profile?.user?.name || "",
        email: profile.email || profile?.user?.email || "",
        mobile: profile.mobile || profile?.user?.mobile || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSaveField = async (field) => {
    try {
      // Keep the same shape you used elsewhere — if your API needs id/token adjust accordingly.
      await updateUser({ [field]: form[field] }).unwrap();
      setSavedField(field);

      // brief delay so UI shows the saved state
      setTimeout(() => {
        setSavedField(null);
        setEditField(null);
        refetch(); // refresh profile data
      }, 900);

      alert(`${field} updated successfully!`);
    } catch (error) {
      console.error(error);
      alert(`Failed to update ${field}`);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent" />
          <p className="text-teal-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="space-y-4">
            {["name", "email", "mobile"].map((field) => (
              <div key={field}>
                {editField === field ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 ml-1">
                      {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="flex-1 bg-slate-50 border-2 border-slate-300 px-4 py-3 rounded-xl focus:outline-none text-slate-900 font-medium"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField(field)}
                        disabled={savedField === field}
                        className="px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                        type="button"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        disabled={savedField === field}
                        className="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                      {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-800 break-all">
                        {profile?.user?.[field] ?? profile?.[field] ?? "N/A"}
                      </p>
                      <button
                        onClick={() => setEditField(field)}
                        className="p-2 text-slate-500 hover:text-teal-600 rounded-lg"
                        type="button"
                        aria-label={`Edit ${field}`}
                      >
                        ✎
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Address Section */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Delivery Address</h2>
            <AddressComponent />
          </div>
        </div>

        <div className="text-center mt-8 text-slate-500/80 text-sm">
          <p>Your data is securely stored and encrypted</p>
        </div>
      </div>
    </div>
  );
}
