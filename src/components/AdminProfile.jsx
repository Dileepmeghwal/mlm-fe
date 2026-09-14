import React, { useContext, useEffect, useState } from "react";
import { getRequest, postRequest, getUserId } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaHome,
  FaIdBadge,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const emptyGeneral = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  dob: "",
  adress1: "",
  adress2: "",
};

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const AdminProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // edit state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyGeneral);
  const [saving, setSaving] = useState(false);

  // password state
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");

  // change-email state
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" });
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  const loadProfile = async () => {
    try {
      const res = await getRequest("/user/profile");
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const startEdit = () => {
    setForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      mobile_number: profile.mobile_number || "",
      dob: profile.dob ? moment(profile.dob).format("YYYY-MM-DD") : "",
      adress1: profile.adress1 || "",
      adress2: profile.adress2 || "",
    });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    try {
      await postRequest("/user/edit-profile/general", {
        first_name: form.first_name,
        last_name: form.last_name,
        mobile_number: form.mobile_number,
        dob: form.dob || null,
        adress1: form.adress1,
        adress2: form.adress2,
      });
      toast.success("Profile updated successfully");
      setEditing(false);
      await loadProfile();
      // keep the nav / context in sync with the new name
      if (setUser && user) {
        setUser({ ...user, first_name: form.first_name, last_name: form.last_name });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail.trim());

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!emailValid) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!emailForm.currentPassword) {
      setEmailError("Please enter your current password to confirm");
      return;
    }
    setEmailSaving(true);
    try {
      const res = await postRequest("/user/change-email", {
        newEmail: emailForm.newEmail.trim(),
        currentPassword: emailForm.currentPassword,
      });
      toast.success("Login email changed. Use the new email next time you log in.");
      setEmailForm({ newEmail: "", currentPassword: "" });
      const updated = res?.data?.email || emailForm.newEmail.trim();
      setProfile((p) => ({ ...p, email: updated }));
      if (setUser && user) setUser({ ...user, email: updated });
    } catch (err) {
      setEmailError(err?.response?.data?.message || "Failed to change email");
    } finally {
      setEmailSaving(false);
    }
  };

  const allPwdRulesPass = passwordRules.every((r) => r.test(pwd.newPassword));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError("");
    if (!pwd.currentPassword) {
      setPwdError("Please enter your current password");
      return;
    }
    if (!allPwdRulesPass) {
      setPwdError("New password does not meet all the requirements");
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdError("New passwords do not match");
      return;
    }
    setPwdSaving(true);
    try {
      await postRequest("/user/change-password", {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      toast.success("Password changed successfully");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwdError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100">
        <p className="text-lg text-red-500">No profile data found.</p>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();

  const Row = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-indigo-500 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-gray-800 break-words">{value || <span className="text-gray-400">Not set</span>}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-10">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center text-2xl font-bold text-indigo-600 border-4 border-white">
                  {initials || <FaUser />}
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {profile.type}
                    </span>
                    <span className="text-xs text-gray-500">{getUserId(profile.userId)}</span>
                  </div>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={startEdit}
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details / Edit card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Details</h2>

          {!editing ? (
            <div>
              <Row icon={<FaUser />} label="Full Name" value={`${profile.first_name} ${profile.last_name}`} />
              <Row icon={<FaEnvelope />} label="Email" value={profile.email} />
              <Row icon={<FaPhone />} label="Mobile Number" value={profile.mobile_number} />
              <Row
                icon={<FaBirthdayCake />}
                label="Date of Birth"
                value={profile.dob ? moment(profile.dob).format("DD MMM YYYY") : ""}
              />
              <Row icon={<FaHome />} label="Address Line 1" value={profile.adress1} />
              <Row icon={<FaHome />} label="Address Line 2" value={profile.adress2} />
              <Row icon={<FaIdBadge />} label="User ID" value={getUserId(profile.userId)} />
              <Row
                icon={<FaCalendarAlt />}
                label="Member Since"
                value={profile.createdAt ? moment(profile.createdAt).format("DD MMM YYYY") : ""}
              />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email <span className="text-xs text-gray-400">(cannot be changed)</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.mobile_number}
                    onChange={(e) =>
                      setForm({ ...form, mobile_number: e.target.value.replace(/[^\d+]/g, "") })
                    }
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.adress1}
                  onChange={(e) => setForm({ ...form, adress1: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address Line 2</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.adress2}
                  onChange={(e) => setForm({ ...form, adress2: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  <FaSave /> {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change login email card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <FaEnvelope className="text-indigo-500" /> Change Login Email
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            This is the email you use to log in. You'll use the new email the next time you sign in.
          </p>

          {emailError && <div className="mb-4 text-sm text-red-500">{emailError}</div>}

          <form onSubmit={handleChangeEmail} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Email</label>
              <input
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                value={profile.email}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                placeholder="new-email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current Password <span className="text-xs text-gray-400">(to confirm it's you)</span>
              </label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={emailForm.currentPassword}
                onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={emailSaving}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              <FaEnvelope /> {emailSaving ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>

        {/* Change password card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaLock className="text-indigo-500" /> Change Password
          </h2>

          {pwdError && <div className="mb-4 text-sm text-red-500">{pwdError}</div>}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 pr-10"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password</label>
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border rounded px-3 py-2"
                value={pwd.newPassword}
                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border rounded px-3 py-2"
                value={pwd.confirmPassword}
                onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                required
              />
            </div>

            <ul className="text-xs space-y-1">
              {passwordRules.map((r) => {
                const passed = r.test(pwd.newPassword);
                return (
                  <li key={r.label} className={passed ? "text-green-600" : "text-gray-400"}>
                    {passed ? "✓" : "○"} {r.label}
                  </li>
                );
              })}
            </ul>

            <button
              type="submit"
              disabled={pwdSaving}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              <FaLock /> {pwdSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
