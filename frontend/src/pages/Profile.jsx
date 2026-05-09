import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function Profile() {
  const { user, login } = useAuth();
  const toast = useToast();
  
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await authAPI.updateProfile(profileForm);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return toast.error("Passwords don't match!");
    setLoading(true);
    
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      
      toast.success("Password changed!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return toast.error("Please select an image first");
    setLoading(true);
    
    try {
      const formData = new FormData();
    
      formData.append("avatar", avatarFile);
    
      await authAPI.uploadAvatar(formData);
    
      toast.success("Avatar updated!");
    
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card" style={{ maxWidth: "560px" }}>
        <h1>My Profile</h1>

        {/* Avatar */}
        <div className="avatar-section">
          
          <div className="avatar-wrap">
            {preview ? (
              <img src={preview} alt="avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
           </div>
          
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              id="avatar-input"
              style={{ display: "none" }}
            />
            
            <label
              htmlFor="avatar-input"
              className="btn-secondary"
              style={{
                cursor: "pointer",
                display: "inline-block",
                padding: "0.5rem 1rem",
                marginBottom: "0.5rem",
              }}
            >
              Choose Photo
            </label>
            
            {avatarFile && (
              <button
                onClick={handleAvatarUpload}
                className="btn-primary"
                style={{ display: "block", marginTop: "0.5rem" }}
                disabled={loading}
              >
                Upload
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Profile Info
          </button>
          
          <button
            className={`tab ${tab === "password" ? "active" : ""}`}
            onClick={() => setTab("password")}
          >
            Change Password
          </button>
        </div>

        {tab === "profile" && (
          <form onSubmit={handleProfileUpdate}>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, username: e.target.value })
                }
                required
                minLength={3}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                required
              />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, newPassword: e.target.value })
                }
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
