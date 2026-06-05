import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiMail } from "react-icons/ci";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageAccount = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.prod.link);

  const [profile, setProfile] = useState(null);
  const [changeAvatar, setChangeAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    userPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const changePass = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const changeImage = (e) => {
    setChangeAvatar(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/getUserProfile`, {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (error) {
        console.error("Fetch profile error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      const response = await axios.put(`${backendUrl}/api/auth/change-password`, passwords, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setPasswords({ userPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    }
  };

  const handleChangeAvatar = async () => {
    if (!changeAvatar) {
      toast.error("Please select an image first");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", changeAvatar);
    try {
      const res = await axios.put(`${backendUrl}/api/auth/change-avatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const profileRes = await axios.get(`${backendUrl}/api/auth/getUserProfile`, {
          withCredentials: true,
        });
        setProfile(profileRes.data.data);
        setChangeAvatar(null);
      }
    } catch (error) {
      console.error("Change avatar error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change avatar. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="alert alert-danger text-center">
        Failed to load profile. Please <a href="/login">login again</a>.
      </div>
    );
  }

  const getAvatarUrl = () => {
    if (changeAvatar) return URL.createObjectURL(changeAvatar);
    if (profile.userAvatar) {
      if (profile.userAvatar.startsWith("http")) return profile.userAvatar;
      return `${backendUrl}${profile.userAvatar}`;
    }
    return null;
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="d-flex flex-column align-items-center">
            <div
              className="border rounded-circle d-flex align-items-center justify-content-center overflow-hidden shadow-sm"
              style={{ width: "150px", height: "150px", background: "#f8f9fa" }}
            >
              <label
                htmlFor="imgFile"
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ cursor: "pointer" }}
              >
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt="Avatar"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FaUser size={60} className="text-secondary" />
                )}
              </label>
            </div>
            <input
              type="file"
              id="imgFile"
              className="d-none"
              onChange={changeImage}
              accept="image/*"
            />
            <button className="btn btn-primary mt-3" onClick={handleChangeAvatar}>
              Change Avatar
            </button>
          </div>

          <div className="flex-grow-1">
            <div className="p-3 rounded-3 bg-light border">
              <h4 className="mb-1 fw-bold">{profile.userName || "User"}</h4>
              <p className="mb-2 text-muted">Blogger • Developer</p>
              <div className="d-flex flex-column gap-1">
                <small className="text-muted">
                  <CiMail /> {profile.userEmail}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <h5 className="mb-4 fw-bold">Change Password</h5>
        <form className="row g-3" onSubmit={handleChangePassword}>
          <div className="col-12">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Current Password"
                name="userPassword"
                value={passwords.userPassword}
                onChange={changePass}
                required
              />
              <label htmlFor="currentPassword">Current Password</label>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New Password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={changePass}
                required
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm New Password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={changePass}
                required
              />
              <label htmlFor="confirmPassword">Confirm New Password</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm w-100">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;