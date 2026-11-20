import { useState } from "react";
import "./StorePages.css";

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
        <button className="store-back" onClick={onBack}>← بازگشت به سایت</button>
      </div>
      <section className="store-heading">
        <span className="tag">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      {children}
      <footer className="store-footer">© 2026 NOVA AI — All Rights Reserved</footer>
    </main>
  );
}

export function AppsPage({ onBack }) {
  return (
    <PageShell
      eyebrow="NOVA APPS"
      title="برنامه‌های جدید NOVA"
      description="ابزارها و نرم‌افزارهای تازه NOVA در این بخش منتشر خواهند شد."
      onBack={onBack}
    >
      <section className="coming-panel">
        <div className="coming-orb">✦</div>
        <h2>برنامه‌های جدید به‌زودی از راه می‌رسند!</h2>
        <p>تاریخ انتشار هنوز مشخص نشده است. پس از آماده‌شدن برنامه‌ها، اطلاعات و لینک دریافت آن‌ها در همین صفحه قرار می‌گیرد.</p>
        <span className="coming-label">COMING SOON</span>
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
        <p>تاریخ انتشار هنوز مشخص نیست. این صفحه پس از آماده‌شدن اپلیکیشن‌ها به‌روزرسانی خواهد شد.</p>
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
      <p className="store-independent-note">خرید هر محصول فقط مجوز همان برنامه را فعال می‌کند.</p>
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
    setNotice("اتصال امن درگاه زرین‌پال و بررسی کد تخفیف در مرحله بعدی پیاده‌سازی می‌شود. هنوز پرداختی انجام نشده است.");
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
          <button className={monthly ? "selected" : ""} onClick={() => { setTerm("monthly"); setNotice(""); }}>
            یک‌ماهه
          </button>
          <button className={!monthly ? "selected" : ""} onClick={() => { setTerm("six"); setNotice(""); }}>
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
        <p className="discount-caption">میزان تخفیف این اشتراک: {discount.toLocaleString("fa-IR")} تومان</p>

        <label className="coupon-field">
          کد تخفیف
          <input
            value={coupon}
            onChange={(event) => { setCoupon(event.target.value); setNotice(""); }}
            placeholder="کد تخفیف خود را وارد کن"
            autoComplete="off"
            spellCheck="false"
          />
        </label>
        <p className="coupon-help">اعتبار و یک‌بارمصرف‌بودن کد هنگام اتصال سرور فروش بررسی می‌شود.</p>

        <button className="payment-placeholder" onClick={continueToPayment}>
          ادامه و پرداخت
        </button>
        {notice && <p className="purchase-notice" role="status">{notice}</p>}
        <p className="purchase-security">پرداخت امن و فعال‌سازی خودکار پس از تأیید تراکنش در مرحله اتصال درگاه فعال خواهد شد.</p>
      </section>
    </PageShell>
  );
}
