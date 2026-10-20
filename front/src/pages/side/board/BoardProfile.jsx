import { API_BASE, SERVER_URL } from "../../../config/api";
import React, { useRef, useState, useEffect } from "react";
import "../../../styles/side/board/Board.css";


export default function BoardProfile({ user, setUser }) {
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState("");

  useEffect(() => {
    if (user?.profile_img) {
      const fullUrl = `${SERVER_URL}${user.profile_img}`;
      setProfileImg(fullUrl);
    }
  }, [user]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);
    formData.append("userId", user.user_id);

    const res = await fetch(`${API_BASE}/profile/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      alert("업로드 실패");
      return;
    }

    const fullUrl = `${SERVER_URL}${data.imageUrl}`;
    setProfileImg(fullUrl);

    const updatedUser = { ...user, profile_img: data.imageUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="profile-box" onClick={handleProfileClick}>
      <img
        src={profileImg || `${SERVER_URL}/profile.png`}
        alt="profile"
        className="profile-img"
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="profile-name">{user?.name}님</div>
      <p className="welcome-text">환영합니다! {user?.name}님 😊</p>
    </div>
  );
}
