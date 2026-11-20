
import { useState } from "react";
import "./StorePages.css";

const FREE_DOWNLOAD_URL =
  "https://github.com/gost901326-ctrl/nova-ai-website/releases/download/v1.0.0/NOVA_AI_FREE.zip";

const products = [
  {
    id: "nova-ai-pro",
    icon: "✦",
    name: "NOVA AI PRO",
    description: "نسخه حرفه‌ای دستیار هوشمند NOVA با امکانات پیشرفته‌تر.",
  },
  {
    id: "nova-system-monitor-pro",
    icon: "◈",
    name: "NOVA SYSTEM MONITOR PRO",
    description: "ابزار حرفه‌ای پایش منابع و وضعیت سیستم.",
  },
];

export function PageShell({ eyebrow, title, description, onBack, children }) {
  return (
    <main className="nova-store-page" dir="rtl">
      <div className="store-topbar">
        <div className="store-brand">NOVA<span>AI</span></div>
        <button className="store-back" onClick={onBack}>
          ← بازگشت به سایت
        </button>
      </div>

      <section className="store-heading">
        <span className="tag">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      {children}

      <footer className="store-footer">
        © 2026 NOVA AI — All Rights Reserved
      </footer>
    </main>
  );
}

export function AppsPage({ onBack }) {
  return (
    <PageShell
      eyebrow="NOVA APPS"
      title="برنامه‌های NOVA"
      description="نسخه رایگان و ابزارهای نرم‌افزاری NOVA را دریافت کن."
      onBack={onBack}
    >
      <section className="coming-panel">
        <div className="coming-orb">✦</div>

        <h2>NOVA AI FREE</h2>

        <p>
          نسخه رایگان دستیار هوشمند NOVA آماده دریافت است.
          همین حالا می‌توانی آن را دانلود کنی.
        </p>

        <div style={{ margin: "22px 0", color: "inherit" }}>
          <p>نسخه: 1.0.0</p>
          <p>نام فایل: NOVA_AI_FREE.zip</p>
          <p>حجم تقریبی: 200 MB</p>
        </div>

        <a
          href={FREE_DOWNLOAD_URL}
          className="free-download-button"
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 30px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #7657ff, #4931c9)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <span>⬇</span>
          دانلود رایگان NOVA AI
        </a>

        <p style={{ marginTop: "16px", fontSize: "13px" }}>
          دانلود مستقیم از GitHub Releases
        </p>

        <span className="coming-label">FREE VERSION — AVAILABLE</span>
      </section>

      <section className="coming-panel" style={{ marginTop: "24px" }}>
        <div className="coming-orb">◈</div>
        <h2>برنامه‌های جدید NOVA</h2>
        <p>
          ابزارها و نرم‌افزارهای جدید NOVA در آینده در همین بخش منتشر خواهند شد.
        </p>
        <span className="coming-label">MORE APPS — COMING SOON</span>
      </section>
    </PageShell>
  );
}

export function AndroidPage({ onBack }) {
  return (
    <PageShell
      eyebrow="NOVA MOBILE"
      title="نرم‌افزارهای اندرویدی"
      description="اپلیکیشن‌های موبایل NOVA در این بخش معرفی و منتشر خواهند شد."
      onBack={onBack}
    >
      <section className="coming-panel mobile-coming">
        <div className="coming-orb">▣</div>
        <h2>اپلیکیشن‌های اندرویدی NOVA به‌زودی منتشر می‌شوند!</h2>
        <p>
          تاریخ انتشار هنوز مشخص نیست. این صفحه پس از آماده‌شدن اپلیکیشن‌ها
          به‌روزرسانی خواهد شد.
        </p>
        <span className="coming-label">ANDROID — COMING SOON</span>
      </section>
    </PageShell>
  );
}

export function ProStorePage({ onBack, onSelectProduct }) {
  return (
    <PageShell
      eyebrow="NOVA PRO STORE"
      title="فروشگاه برنامه‌های حرفه‌ای"
      description="هر برنامه و اشتراک به‌صورت مستقل خریداری و فعال می‌شود."
      onBack={onBack}
    >
      <section className="store-product-grid">
        {products.map((product) => (
          <article className="store-product-card" key={product.id}>
            <div className="store-product-icon">{product.icon}</div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <button onClick={() => onSelectProduct(product)}>
              مشاهده اشتراک‌ها <span>←</span>
            </button>
          </article>
        ))}
      </section>

      <p className="store-independent-note">
        خرید هر محصول فقط مجوز همان برنامه را فعال می‌کند.
      </p>
    </PageShell>
  );
}

export function ProductPage({ product, onBack }) {
  const [term, setTerm] = useState("monthly");
  const [coupon, setCoupon] = useState("");
  const [notice, setNotice] = useState("");

  const monthly = term === "monthly";
  const originalPrice = monthly ? 80000 : 480000;
  const discountedPrice = monthly ? 55000 : 400000;
  const discount = monthly ? 25000 : 80000;

  function continueToPayment() {
    setNotice(
      "اتصال امن درگاه زرین‌پال و بررسی کد تخفیف در مرحله بعدی پیاده‌سازی می‌شود. هنوز پرداختی انجام نشده است."
    );
  }

  return (
    <PageShell
      eyebrow="NOVA PRO SUBSCRIPTION"
      title={product?.name || "اشتراک NOVA PRO"}
      description="مدت اشتراک را انتخاب کن. این خرید فقط برای همین برنامه اعتبار ایجاد می‌کند."
      onBack={onBack}
    >
      <section className="purchase-panel">
        <div className="term-switch" role="group" aria-label="مدت اشتراک">
          <button
            className={monthly ? "selected" : ""}
            onClick={() => {
              setTerm("monthly");
              setNotice("");
            }}
          >
            یک‌ماهه
          </button>

          <button
            className={!monthly ? "selected" : ""}
            onClick={() => {
              setTerm("six");
              setNotice("");
            }}
          >
            شش‌ماهه
          </button>
        </div>

        <div className="purchase-price">
          <span>قیمت اصلی</span>
          <strong>{originalPrice.toLocaleString("fa-IR")} تومان</strong>
        </div>

        <div className="purchase-price discounted">
          <span>قیمت با کد تخفیف معتبر</span>
          <strong>{discountedPrice.toLocaleString("fa-IR")} تومان</strong>
        </div>

        <p className="discount-caption">
          میزان تخفیف این اشتراک: {discount.toLocaleString("fa-IR")} تومان
        </p>

        <label className="coupon-field">
          کد تخفیف
          <input
            value={coupon}
            onChange={(event) => {
              setCoupon(event.target.value);
              setNotice("");
            }}
            placeholder="کد تخفیف خود را وارد کن"
            autoComplete="off"
            spellCheck="false"
          />
        </label>

        <p className="coupon-help">
          اعتبار و یک‌بارمصرف‌بودن کد هنگام اتصال سرور فروش بررسی می‌شود.
        </p>

        <button className="payment-placeholder" onClick={continueToPayment}>
          ادامه و پرداخت
        </button>

        {notice && (
          <p className="purchase-notice" role="status">
            {notice}
          </p>
        )}

        <p className="purchase-security">
          پرداخت امن و فعال‌سازی خودکار پس از تأیید تراکنش در مرحله اتصال درگاه فعال خواهد شد.
        </p>
      </section>
    </PageShell>
  );
}
