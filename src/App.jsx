
import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [language, setLanguage] = useState("fa");
  const [showDashboard, setShowDashboard] = useState(false);

  const fa = language === "fa";

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

  const showPurchaseMessage = () => {
    alert(
      fa
        ? "سیستم خرید نسخه حرفه‌ای هنوز فعال نشده است."
        : "The Pro purchase system is not active yet."
    );
  };

  if (showDashboard) {
    return (
      <Dashboard
        onBack={() => setShowDashboard(false)}
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

          <button
            className="login-btn"
            onClick={() => setShowDashboard(true)}
          >
            {content.login}
          </button>
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

          <p className="coming-soon">
            ✦ {fa
              ? "انتشار نسخه‌های NOVA AI به‌زودی"
              : "NOVA AI versions coming soon"}
          </p>

        </section>

      </main>

      <footer>
        <div className="logo">NOVA<span>AI</span></div>
        <p>© 2026 NOVA AI — All Rights Reserved</p>
      </footer>

    </div>
  );
}

export default App;
