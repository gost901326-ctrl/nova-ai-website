
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./Profile.css";

const emptyProfile = {
  first_name: "",
  last_name: "",
  username: "",
  bio: "",
  avatar: "",
};

export default function Profile({ onBack, user }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const email = user?.email || "";

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.id) {
        setError("حساب کاربری شناسایی نشد.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: loadError } = await supabase
        .from("customer_profiles")
        .select("first_name, last_name, username, bio, avatar")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (loadError) {
        setError("بارگذاری پروفایل انجام نشد: " + loadError.message);
      } else if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.id]);

  function updateField(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user?.id) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError("فقط تصویر JPG، PNG یا WebP تا ۲ مگابایت مجاز است.");
      return;
    }

    setUploading(true);
    setError("");
    const path = `${user.id}/avatar.${file.type.split("/")[1]}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError("آپلود تصویر انجام نشد: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;
    const { error: dbError } = await supabase
      .from("customer_profiles")
      .update({ avatar: url })
      .eq("id", user.id);

    setUploading(false);
    if (dbError) {
      setError("ذخیرهٔ تصویر انجام نشد: " + dbError.message);
      return;
    }
    setProfile((previous) => ({ ...previous, avatar: url }));
  }

  async function saveProfile(event) {
    event.preventDefault();

    if (!user?.id) {
      setError("برای ذخیره اطلاعات باید وارد حساب شوی.");
      return;
    }

    const username = profile.username.trim();
    if (username && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError("نام کاربری فقط شامل حروف انگلیسی، عدد و _ و بین ۳ تا ۳۰ کاراکتر باشد.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    const fullName = [
      profile.first_name.trim(),
      profile.last_name.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const { error: saveError } = await supabase
      .from("customer_profiles")
      .update({
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        username: profile.username.trim() || null,
        bio: profile.bio.trim(),
        full_name: fullName || "کاربر NOVA",
      })
      .eq("id", user.id);

    setSaving(false);

    if (saveError) {
      setError(
        saveError.code === "23505"
          ? "این نام کاربری قبلاً انتخاب شده است."
          : "ذخیره پروفایل انجام نشد: " + saveError.message
      );
      return;
    }

    setSaved(true);
  }

  const displayName =
    [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") ||
    profile.username ||
    "N";

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

      {loading ? (
        <div className="profile-container">
          <p>در حال بارگذاری اطلاعات پروفایل...</p>
        </div>
      ) : (
        <form
          className="profile-container"
          onSubmit={saveProfile}
        >
          <section className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
              ) : (
                <span>{displayName[0] || "N"}</span>
              )}
            </div>

            <label className="profile-save" style={{ cursor: "pointer", display: "inline-block" }}>
              {uploading ? "در حال آپلود..." : "انتخاب تصویر پروفایل"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} disabled={uploading} hidden />
            </label>
          </section>

          <div className="profile-form-grid">
            <label>
              نام
              <input
                name="first_name"
                value={profile.first_name}
                onChange={updateField}
                placeholder="نام خود را وارد کن"
                maxLength={80}
              />
            </label>

            <label>
              نام خانوادگی
              <input
                name="last_name"
                value={profile.last_name}
                onChange={updateField}
                placeholder="نام خانوادگی"
                maxLength={80}
              />
            </label>

            <label>
              نام کاربری
              <input
                name="username"
                value={profile.username}
                onChange={updateField}
                placeholder="مثلاً nova_user"
                maxLength={30}
              />
            </label>

            <label>
              ایمیل حساب
              <input
                type="email"
                value={email}
                readOnly
                disabled
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
              maxLength={500}
            />
          </label>

          {error && (
            <p className="profile-message">{error}</p>
          )}

          <div className="profile-footer">
            <span className="profile-message">
              {saved ? "✓ پروفایل با موفقیت ذخیره شد" : ""}
            </span>

            <button
              type="submit"
              className="profile-save"
              disabled={saving}
            >
              {saving ? "در حال ذخیره..." : "ذخیره پروفایل"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
