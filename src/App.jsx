
import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabase";
import { AppsPage, AndroidPage, ProStorePage, ProductPage } from "./StorePages";
import { AboutPage, ContactPage, TermsPage } from "./InfoPages";
import ResetPassword from "./ResetPassword";

function App() {
  const [language, setLanguage] = useState("fa");
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recovering, setRecovering] = useState(false);

  const fa = language === "fa";

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session check failed:", error.message);
      }

      setSession(data?.session ?? null);
      setCheckingSession(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession);
        if (event === "PASSWORD_RECOVERY") setRecovering(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const content = {
    title: fa ? "آینده هوش مصنوعی اینجاست" : "The Future of AI Is Here",
    subtitle: fa
      ? "با NOVA AI، دستیار هوشمند شخصی خودت را تجربه کن."
      : "Experience your own intelligent assistant with NOVA AI.",
    start: fa ? "شروع کنید" : "Get Started",
    features: fa ? "امکانات NOVA" : "NOVA Features",
    about: fa ? "درباره ما" : "About Us",
    pricing: fa ? "نسخه‌های برنامه" : "Available Versions",
    login: fa ? "پنل کاربری" : "Dashboard",
    description: fa
      ? "یک دستیار هوشمند برای ساده‌تر کردن کارهای روزمره و تجربه‌ای متفاوت از فناوری."
      : "An intelligent assistant designed to simplify everyday tasks.",
    cards: fa
      ? [
          ["🤖", "دستیار هوشمند", "تعامل با یک دستیار هوشمند و کمک در انجام کارها."],
          ["⚡", "سرعت و سادگی", "طراحی مدرن برای دسترسی سریع و آسان."],
          ["🎨", "شخصیت‌های متنوع", "انتخاب از میان چهار شخصیت اختصاصی NOVA."]
        ]
      : [
          ["🤖", "Smart Assistant", "Interact with an intelligent assistant."],
          ["⚡", "Fast & Simple", "A modern design for easy access."],
          ["🎨", "Unique Characters", "Choose from four NOVA characters."]
        ]
  };

  const goToVersions = () => {
    document.getElementById("downloads")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const showDownloadMessage = (version) => {
    alert(
      fa
        ? `نسخه ${version} هنوز برای دانلود آماده نشده است. به‌زودی منتشر می‌شود!`
        : `${version} version is not available for download yet. Coming soon!`
    );
  };

  const showPurchaseMessage = () => setActivePage("store");

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(
        fa
          ? "خروج از حساب انجام نشد. دوباره تلاش کن."
          : "Could not sign out. Please try again."
      );
      console.error(error);
    }
  }

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#030817",
          color: "#00baff",
          fontFamily: "Vazirmatn, sans-serif",
          fontSize: "16px",
        }}
      >
        NOVA AI — Loading...
      </div>
    );
  }

  if (recovering) {
    return (
      <ResetPassword
        onDone={() => {
          setRecovering(false);
          setShowDashboard(true);
        }}
      />
    );
  }

  if (session && showDashboard) {
    return (
      <Dashboard
        user={session.user}
        onBack={() => setShowDashboard(false)}
        onLogout={handleLogout}
      />
    );
  }

  if (showAuth) {
    return (
      <Auth
        onSuccess={(newSession) => {
          setSession(newSession);
          setShowAuth(false);
          setShowDashboard(true);
        }}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  if (activePage === "about") return <AboutPage onBack={() => setActivePage("home")} />;
  if (activePage === "contact") return <ContactPage onBack={() => setActivePage("home")} />;
  if (activePage === "terms") return <TermsPage onBack={() => setActivePage("home")} />;
  if (activePage === "apps") return <AppsPage onBack={() => setActivePage("home")} />;
  if (activePage === "android") return <AndroidPage onBack={() => setActivePage("home")} />;
  if (activePage === "store") {
    return (
      <ProStorePage
        onBack={() => setActivePage("home")}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setActivePage("product");
        }}
      />
    );
  }
  if (activePage === "product") {
    return (
      <ProductPage
        product={selectedProduct}
        onBack={() => setActivePage("store")}
      />
    );
  }

  return (
    <div className="app" dir={fa ? "rtl" : "ltr"}>
      <header className="navbar">
        <div className="logo">NOVA<span>AI</span></div>

        <nav>
          <a href="#features">{content.features}</a>
          <a href="#about">{content.about}</a>
          <a href="#downloads">{content.pricing}</a>
        </nav>

        <div className="nav-actions">
          <button
            className="language-btn"
            onClick={() => setLanguage(fa ? "en" : "fa")}
          >
            {fa ? "EN" : "FA"}
          </button>

          {session ? (
            <button
              className="profile-nav-btn"
              onClick={() => setShowDashboard(true)}
              aria-label={fa ? "بازکردن پنل کاربری" : "Open account dashboard"}
              title={fa ? "پنل کاربری" : "Dashboard"}
            >
              {(
                session.user.user_metadata?.avatar_url ||
                session.user.user_metadata?.picture ||
                session.user.user_metadata?.avatar
              ) ? (
                <img
                  src={
                    session.user.user_metadata?.avatar_url ||
                    session.user.user_metadata?.picture ||
                    session.user.user_metadata?.avatar
                  }
                  alt="Profile"
                />
              ) : (
                <span>{(session.user.email || "N").charAt(0).toUpperCase()}</span>
              )}
            </button>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              {content.login}
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow"></div>

          <div className="hero-content">
            <div className="tag">✦ NEXT GENERATION AI</div>

            <h1>
              {content.title}
              <span className="blue-text"> NOVA AI</span>
            </h1>

            <p>{content.subtitle}</p>

            <button className="primary-btn" onClick={goToVersions}>
              {content.start} <span>←</span>
            </button>
          </div>

          <div className="nova-orb">
            <div className="orb-inner">N</div>
          </div>

          <div className="hero-bottom">
            <span>INTELLIGENCE</span>
            <span>INNOVATION</span>
            <span>FUTURE</span>
          </div>
        </section>

        <section className="features section" id="features">
          <div className="section-heading">
            <span className="tag">WHAT WE OFFER</span>
            <h2>{content.features}</h2>
          </div>

          <div className="feature-grid">
            {content.cards.map((card, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{card[0]}</div>
                <h3>{card[1]}</h3>
                <p>{card[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <span className="tag">ABOUT NOVA</span>
          <h2>{content.about}</h2>
          <p>{content.description}</p>
        </section>

        <section className="pricing section" id="downloads">
          <span className="tag">CHOOSE YOUR EXPERIENCE</span>

          <h2>{content.pricing}</h2>

          <p className="download-intro">
            {fa
              ? "نسخه مناسب خودت را انتخاب کن."
              : "Choose the version that suits you."}
          </p>

          <div className="price-grid">
            <div className="price-card">
              <div className="feature-icon">🚀</div>

              <h3>{fa ? "نسخه رایگان" : "Free Version"}</h3>

              <div className="price">FREE</div>

              <p>
                {fa
                  ? "شروع رایگان با امکانات پایه NOVA AI"
                  : "Start using NOVA AI with basic features."}
              </p>

              <button
                className="version-btn"
                onClick={() => showDownloadMessage("رایگان")}
              >
                {fa ? "دانلود رایگان" : "Free Download"}
              </button>
            </div>

            <div className="price-card premium">
              <div className="feature-icon">💎</div>

              <h3>{fa ? "نسخه حرفه‌ای" : "Professional Version"}</h3>

              <div className="price">PRO</div>

              <p>
                {fa
                  ? "امکانات بیشتر و تجربه حرفه‌ای‌تر"
                  : "More features and a professional experience."}
              </p>

              <button
                className="version-btn"
                onClick={showPurchaseMessage}
              >
                {fa ? "خرید نسخه حرفه‌ای" : "Get Pro"}
              </button>
            </div>
          </div>

          <div className="nova-collection-grid">
            <button className="nova-collection-card apps-card" onClick={() => setActivePage("apps")}>
              <span className="collection-icon">✦</span>
              <strong>NOVA APPS</strong>
              <span>{fa ? "برنامه‌های جدید" : "New Applications"}</span>
              <small>{fa ? "مشاهده برنامه‌ها" : "Explore apps"} ←</small>
            </button>

            <button className="nova-collection-card android-card" onClick={() => setActivePage("android")}>
              <span className="collection-icon">▣</span>
              <strong>NOVA MOBILE</strong>
              <span>{fa ? "نرم‌افزارهای اندرویدی" : "Android Applications"}</span>
              <small>{fa ? "مشاهده اپلیکیشن‌ها" : "Explore apps"} ←</small>
            </button>
          </div>

          <p className="coming-soon">
            ✦ {fa
              ? "انتشار نسخه‌های NOVA AI به‌زودی"
              : "NOVA AI versions coming soon"}
          </p>
        </section>
      </main>

      <footer>
        <div className="logo">NOVA<span>AI</span></div>
        <div className="footer-links">
          <button onClick={() => setActivePage("about")}>{fa ? "درباره ما" : "About"}</button>
          <button onClick={() => setActivePage("contact")}>{fa ? "تماس با ما" : "Contact"}</button>
          <button onClick={() => setActivePage("terms")}>{fa ? "قوانین و شرایط" : "Terms"}</button>
        </div>
        <p>© 2026 NOVA AI — All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
