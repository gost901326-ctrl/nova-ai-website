
import { useEffect, useState } from "react";
import "./Profile.css";

const STORAGE_KEY = "nova_user_profile";

const emptyProfile = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  bio: "",
  avatar: "",
};

export default function Profile({ onBack }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setProfile({
          ...emptyProfile,
          ...JSON.parse(stored),
        });
      }
    } catch {
      console.error("Could not load NOVA profile");
    }
  }, []);

  function updateField(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  function chooseAvatar(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک تصویر انتخاب کن.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم تصویر باید کمتر از ۲ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((previous) => ({
        ...previous,
        avatar: reader.result,
      }));

      setSaved(false);
    };

    reader.readAsDataURL(file);
  }

  function saveProfile(event) {
    event.preventDefault();

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );

      setSaved(true);
    } catch {
      alert("ذخیره پروفایل انجام نشد. فضای مرورگر را بررسی کن.");
    }
  }

  return (
    <div className="profile-page" dir="rtl">
      <header className="profile-header">
        <div>
          <h1>
            NOVA <span>PROFILE</span>
          </h1>
          <p>پروفایل اختصاصی حساب کاربری تو</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="profile-back"
        >
          بازگشت به پنل
        </button>
      </header>

      <form
        className="profile-container"
        onSubmit={saveProfile}
      >
        <section className="profile-avatar-section">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="تصویر پروفایل"
              />
            ) : (
              <span>
                {profile.firstName?.[0] || "N"}
              </span>
            )}
          </div>

          <label className="avatar-upload">
            انتخاب تصویر پروفایل

            <input
              type="file"
              accept="image/*"
              onChange={chooseAvatar}
              hidden
            />
          </label>

          <small>حداکثر حجم تصویر: ۲ مگابایت</small>
        </section>

        <div className="profile-form-grid">
          <label>
            نام
            <input
              name="firstName"
              value={profile.firstName}
              onChange={updateField}
              placeholder="نام خود را وارد کن"
            />
          </label>

          <label>
            نام خانوادگی
            <input
              name="lastName"
              value={profile.lastName}
              onChange={updateField}
              placeholder="نام خانوادگی"
            />
          </label>

          <label>
            نام کاربری
            <input
              name="username"
              value={profile.username}
              onChange={updateField}
              placeholder="مثلاً nova_user"
            />
          </label>

          <label>
            ایمیل
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={updateField}
              placeholder="example@email.com"
            />
          </label>
        </div>

        <label className="profile-bio">
          درباره من

          <textarea
            name="bio"
            value={profile.bio}
            onChange={updateField}
            placeholder="کمی درباره خودت بنویس..."
            rows={4}
          />
        </label>

        <div className="profile-footer">
          <span className="profile-message">
            {saved ? "✓ پروفایل با موفقیت ذخیره شد" : ""}
          </span>

          <button
            type="submit"
            className="profile-save"
          >
            ذخیره پروفایل
          </button>
        </div>
      </form>
    </div>
  );
}
