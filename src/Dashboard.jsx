
import { useEffect, useState } from "react";
import "./Dashboard.css";
import Profile from "./Profile";
import { supabase } from "./lib/supabase";

const defaultProfile = {
  first_name: "",
  last_name: "",
  username: "",
  bio: "",
  avatar: "",
};

const planNames = { monthly: "یک‌ماهه", six_month: "شش‌ماهه" };
const orderStatus = { pending: "در انتظار", paid: "پرداخت‌شده", failed: "ناموفق", cancelled: "لغوشده" };

export default function Dashboard({ onBack, onLogout, user }) {
  const [language, setLanguage] = useState("fa");
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);

  const isFa = language === "fa";
  const email = user?.email || "";

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.id) {
        setProfile(defaultProfile);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      const { data, error } = await supabase
        .from("customer_profiles")
        .select("first_name, last_name, username, bio, avatar")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Profile loading failed:", error.message);
      }

      if (data) {
        setProfile({
          ...defaultProfile,
          ...data,
        });
      }

      setLoadingProfile(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    async function loadBilling() {
      const [subs, ords] = await Promise.all([
        supabase.from("subscriptions").select("product_id, plan, status, expires_at").eq("user_id", user.id),
        supabase.from("orders").select("id, product_id, plan, amount, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (!active) return;
      setSubscriptions(subs.data ?? []);
      setOrders(ords.data ?? []);
    }

    loadBilling();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const activeSubs = subscriptions.filter(
    (s) => s.status === "active" && new Date(s.expires_at) > new Date()
  );
  const planLabel = activeSubs.length ? "PRO" : isFa ? "رایگان" : "Free";

  const authAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar ||
    "";

  const displayName =
    [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") ||
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
      logout: "خروج از حساب",
      welcome: `سلام، ${displayName}!`,
      editProfile: "ویرایش پروفایل",
      loading: "در حال دریافت اطلاعات حساب...",
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
      logout: "Sign Out",
      welcome: `Hello, ${displayName}!`,
      editProfile: "Edit Profile",
      loading: "Loading account information...",
    },
  };

  const t = content[language];

  if (activeTab === "profile") {
    return (
      <Profile
        user={user}
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
            {(profile.avatar || authAvatar) ? (
              <img src={profile.avatar || authAvatar} alt="Profile" />
            ) : (
              <span>{displayName[0] || "N"}</span>
            )}
          </div>

          <div>
            <strong>{displayName}</strong>
            <small>{email || "NOVA Account"}</small>
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

        <button className="logout-button" onClick={onLogout || onBack}>
          ↪ {t.logout}
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <div className="dashboard-header-actions">
            <button className="language-switch" onClick={onBack}>
              {isFa ? "بازگشت به سایت" : "Back to Website"}
            </button>
            <button
              className="language-switch"
              onClick={() => setLanguage(isFa ? "en" : "fa")}
            >
              {isFa ? "EN" : "FA"}
            </button>
          </div>
        </header>

        {loadingProfile ? (
          <section className="dashboard-panel">
            <p>{t.loading}</p>
          </section>
        ) : (
          <>
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
                    <h2>{planLabel}</h2>
                  </div>

                  <div className="dashboard-card">
                    <span>◉</span>
                    <p>{t.status}</p>
                    <h2>{t.active}</h2>
                  </div>

                  <div className="dashboard-card">
                    <span>▤</span>
                    <p>{t.orders}</p>
                    <h2>{orders.length}</h2>
                  </div>
                </section>

                <section className="dashboard-panel">
                  <h2>{t.account}</h2>

                  <div className="dashboard-profile-preview">
                    <div className="sidebar-avatar large">
                      {(profile.avatar || authAvatar) ? (
                        <img src={profile.avatar || authAvatar} alt="Profile" />
                      ) : (
                        <span>{displayName[0] || "N"}</span>
                      )}
                    </div>

                    <div>
                      <h3>{displayName}</h3>
                      <p>{email || "NOVA Account"}</p>
                    </div>
                  </div>

                  <p>{t.plan}: {planLabel}</p>
                  {activeSubs.map((s) => (
                    <p key={s.product_id}>
                      {s.product_id} — {planNames[s.plan] || s.plan} — {new Date(s.expires_at).toLocaleDateString(isFa ? "fa-IR" : "en-US")}
                    </p>
                  ))}

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
                {orders.length === 0 ? (
                  <p>{t.noOrders}</p>
                ) : (
                  orders.map((o) => (
                    <p key={o.id}>
                      {o.product_id} — {planNames[o.plan] || o.plan} — {Number(o.amount).toLocaleString(isFa ? "fa-IR" : "en-US")} — {orderStatus[o.status] || o.status}
                    </p>
                  ))
                )}
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
          </>
        )}
      </main>
    </div>
  );
}
