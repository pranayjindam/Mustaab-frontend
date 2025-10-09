import React, { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateUserMutation,
} from "../redux/api/userApi";
import AddressComponent from "../client/pages/checkout/AddressComponent";
const ProfilePage = () => {
  const {
    data: profile,
    isLoading: loadingProfile,
    refetch,
  } = useGetProfileQuery();
  const [updateUser] = useUpdateUserMutation();

  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [savedField, setSavedField] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSaveField = async (field) => {
    try {
      await updateUser({ [field]: form[field] }).unwrap();
      setSavedField(field);
      setTimeout(() => {
        setSavedField(null);
        setEditField(null);
        refetch(); // ✅ Refresh user profile automatically
      }, 1200);
      alert(`${field} updated successfully!`);
    } catch (error) {
      console.error(error);
      alert(`Failed to update ${field}`);
    }
  };

  if (loadingProfile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-6">
        <style>{`
          @keyframes spin-smooth {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent"
            style={{ animation: "spin-smooth 1s linear infinite" }}
          />
          <p className="text-teal-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-12 px-4">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .floating { animation: float 3s ease-in-out infinite; }
        .field-container { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .address-container { animation: fadeInUp 0.6s ease-out 0.4s forwards; opacity: 0; }
        .header-section { animation: fadeInUp 0.6s ease-out; }
        .profile-card { animation: fadeInUp 0.6s ease-out 0.05s forwards; opacity: 0; }
        .edit-button, .input-field, .field-item { transition: all 0.3s ease; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="header-section text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center floating shadow-lg shadow-teal-500/20">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your personal information
          </p>
        </div>

        {/* Profile Card */}
        <div className="profile-card bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl shadow-slate-400/10">
          <div className="space-y-4">
            {["name", "email", "mobile"].map((field) => (
              <div key={field} className="field-container">
                {editField === field ? (
                  <div className="space-y-3 animate-slideInFromLeft">
                    <label className="block text-sm font-semibold text-slate-700 ml-1">
                      {field === "name"
                        ? "Full Name"
                        : field === "email"
                        ? "Email Address"
                        : "Phone Number"}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="input-field flex-1 bg-slate-50 border-2 border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900 font-medium"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField(field)}
                        disabled={savedField === field}
                        className="save-button px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-95 shadow-lg shadow-green-500/20"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        disabled={savedField === field}
                        className="cancel-button px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="field-item bg-slate-50/70 hover:bg-slate-100 border border-transparent hover:border-teal-300 rounded-2xl p-5 group cursor-default">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                      {field === "name"
                        ? "Full Name"
                        : field === "email"
                        ? "Email Address"
                        : "Phone Number"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-800 break-all">
                        {profile?.user?.[field] || "N/A"}
                      </p>
                      <button
                        onClick={() => setEditField(field)}
                        className="edit-button opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-500/10 rounded-lg"
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
          <div className="address-container mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Delivery Address
            </h2>
            <AddressComponent />
          </div>
        </div>

        <div className="text-center mt-8 text-slate-500/80 text-sm">
          <p>Your data is securely stored and encrypted</p>
        </div>
      </div>
    </div>
  );
};

/* --- Inline Address Component with Auto Refresh --- */
AddressComponent 

export default ProfilePage;
