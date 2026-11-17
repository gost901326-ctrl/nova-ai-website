
import { useEffect, useState } from "react";
import "./Dashboard.css";
import Profile from "./Profile";

const STORAGE_KEY = "nova_user_profile";

const defaultProfile = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  bio: "",
  avatar: "",
};

export default function Dashboard({ onBack }) {
  const [language, setLanguage] = useState("fa");
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(defaultProfile);

  const isFa = language === "fa";

  useEffect(() => {
    function loadProfile() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        setProfile(
          stored
            ? { ...defaultProfile, ...JSON.parse(stored) }
            : defaultProfile
        );
      } catch {
        setProfile(defaultProfile);
      }
    }

    loadProfile();

    window.addEventListener("storage", loadProfile);

    return () => {
      window.removeEventListener("storage", loadProfile);
    };
  }, [activeTab]);

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username ||
    (isFa ? "کاربر NOVA" : "NOVA User");

  const content = {
    fa: {
      title: "پنل کاربری NOVA",
      subtitle: "به فضای اختصاصی خودت خوش اومدی",
      overview: "داشبورد",
      profile: "پروفایل من",
      orders: "سفارش‌های من",
      downloads: "دانلودها",
      settings: "تنظیمات",
      account: "اطلاعات حساب",
      plan: "اشتراک فعلی",
      free: "رایگان",
      status: "وضعیت حساب",
      active: "فعال",
      orderTitle: "سفارش‌های اخیر",
      noOrders: "هنوز سفارشی ثبت نکردی.",
      noDownloads: "فعلاً نسخه‌ای برای دانلود منتشر نشده.",
      settingsText: "تنظیمات حساب در نسخه‌های بعدی فعال می‌شود.",
      email: "ایمیل",
      logout: "بازگشت به سایت",
      welcome: `سلام، ${displayName}!`,
      editProfile: "ویرایش پروفایل",
    },
    en: {
      title: "NOVA Dashboard",
      subtitle: "Welcome to your personal space",
      overview: "Overview",
      profile: "My Profile",
      orders: "My Orders",
      downloads: "Downloads",
      settings: "Settings",
      account: "Account Information",
      plan: "Current Plan",
      free: "Free",
      status: "Account Status",
      active: "Active",
      orderTitle: "Recent Orders",
      noOrders: "You haven't placed any orders yet.",
      noDownloads: "No downloadable version has been released yet.",
      settingsText: "Account settings will be available in future updates.",
      email: "Email",
      logout: "Back to Website",
      welcome: `Hello, ${displayName}!`,
      editProfile: "Edit Profile",
    },
  };

  const t = content[language];

  if (activeTab === "profile") {
    return (
      <Profile
        onBack={() => setActiveTab("overview")}
      />
    );
  }

  return (
    <div className={`dashboard ${isFa ? "rtl" : "ltr"}`}>
      <aside className="sidebar">
        <h2 className="dashboard-logo">
          NOVA<span> AI</span>
        </h2>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              <span>{displayName[0] || "N"}</span>
            )}
          </div>

          <div>
            <strong>{displayName}</strong>
            <small>{profile.email || "Demo Account"}</small>
          </div>
        </div>

        <nav>
          <button
            className={activeTab === "overview" ? "selected" : ""}
            onClick={() => setActiveTab("overview")}
          >
            ◈ {t.overview}
          </button>

          <button
            className={activeTab === "profile" ? "selected" : ""}
            onClick={() => setActiveTab("profile")}
          >
            👤 {t.profile}
          </button>

          <button
            className={activeTab === "orders" ? "selected" : ""}
            onClick={() => setActiveTab("orders")}
          >
            ▤ {t.orders}
          </button>

          <button
            className={activeTab === "downloads" ? "selected" : ""}
            onClick={() => setActiveTab("downloads")}
          >
            ⇩ {t.downloads}
          </button>

          <button
            className={activeTab === "settings" ? "selected" : ""}
            onClick={() => setActiveTab("settings")}
          >
            ⚙ {t.settings}
          </button>
        </nav>

        <button className="logout-button" onClick={onBack}>
          ↪ {t.logout}
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <button
            className="language-switch"
            onClick={() => setLanguage(isFa ? "en" : "fa")}
          >
            {isFa ? "EN" : "FA"}
          </button>
        </header>

        {activeTab === "overview" && (
          <>
            <section className="welcome-card">
              <span>✦</span>
              <div>
                <h2>{t.welcome}</h2>
                <p>{t.subtitle}</p>
              </div>
            </section>

            <section className="dashboard-cards">
              <div className="dashboard-card">
                <span>✧</span>
                <p>{t.plan}</p>
                <h2>{t.free}</h2>
              </div>

              <div className="dashboard-card">
                <span>◉</span>
                <p>{t.status}</p>
                <h2>{t.active}</h2>
              </div>

              <div className="dashboard-card">
                <span>▤</span>
                <p>{t.orders}</p>
                <h2>0</h2>
              </div>
            </section>

            <section className="dashboard-panel">
              <h2>{t.account}</h2>

              <div className="dashboard-profile-preview">
                <div className="sidebar-avatar large">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" />
                  ) : (
                    <span>{displayName[0] || "N"}</span>
                  )}
                </div>

                <div>
                  <h3>{displayName}</h3>
                  <p>{profile.email || "Demo Account"}</p>
                </div>
              </div>

              <p>{t.plan}: {t.free}</p>

              <button
                className="language-switch"
                onClick={() => setActiveTab("profile")}
              >
                {t.editProfile}
              </button>
            </section>
          </>
        )}

        {activeTab === "orders" && (
          <section className="dashboard-panel">
            <h2>{t.orderTitle}</h2>
            <p>{t.noOrders}</p>
          </section>
        )}

        {activeTab === "downloads" && (
          <section className="dashboard-panel">
            <h2>{t.downloads}</h2>
            <p>{t.noDownloads}</p>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="dashboard-panel">
            <h2>{t.settings}</h2>
            <p>{t.settingsText}</p>
          </section>
        )}
      </main>
    </div>
  );
}
