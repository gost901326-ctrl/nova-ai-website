import { PageShell } from "./StorePages";

const placeholder = "[اطلاعات رسمی هنوز ثبت نشده است]";

export function AboutPage({ onBack }) {
  return (
    <PageShell
      eyebrow="ABOUT NOVA AI"
      title="درباره NOVA AI"
      description="NOVA AI یک پلتفرم نرم‌افزارهای هوشمند است که با تمرکز بر سادگی و تجربهٔ کاربری مدرن ساخته می‌شود."
      onBack={onBack}
    >
      <section className="info-panel">
        <h2>ماموریت</h2>
        <p>ساده‌کردن کارهای روزمره با ابزارهای هوشمند و طراحی‌شده برای کاربر فارسی‌زبان.</p>
        <h2>محصولات</h2>
        <p>دستیار NOVA AI، ابزار NOVA SYSTEM MONITOR و اپلیکیشن‌های اندرویدی NOVA. هر محصول و اشتراک به‌صورت مستقل عرضه می‌شود.</p>
        <h2>اطلاعات تیم و شرکت</h2>
        <p>{placeholder}</p>
      </section>
    </PageShell>
  );
}

export function ContactPage({ onBack }) {
  const rows = [
    ["ایمیل پشتیبانی", placeholder],
    ["تلگرام / شبکه‌های اجتماعی", placeholder],
    ["شماره تماس", placeholder],
    ["آدرس", placeholder],
  ];
  return (
    <PageShell
      eyebrow="CONTACT US"
      title="تماس با ما"
      description="راه‌های ارتباطی رسمی NOVA AI در این صفحه قرار می‌گیرد."
      onBack={onBack}
    >
      <section className="info-panel">
        {rows.map(([label, value]) => (
          <div className="info-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
        <p className="info-note">این مقادیر را با اطلاعات واقعی جایگزین کن؛ هیچ اطلاعات تماسی ساختگی در سایت درج نشده است.</p>
      </section>
    </PageShell>
  );
}

export function TermsPage({ onBack }) {
  return (
    <PageShell
      eyebrow="TERMS"
      title="قوانین و شرایط استفاده"
      description="پیش‌نویس اولیه؛ پیش از انتشار رسمی باید توسط مشاور حقوقی بازبینی شود."
      onBack={onBack}
    >
      <section className="info-panel">
        <h2>حساب کاربری</h2>
        <p>کاربر مسئول حفظ اطلاعات ورود حساب خود است و باید اطلاعات صحیح وارد کند.</p>
        <h2>اشتراک‌ها</h2>
        <p>هر اشتراک فقط برای همان برنامه معتبر است و پس از پایان مدت منقضی می‌شود. قیمت‌ها و مدت اشتراک در صفحهٔ هر محصول نمایش داده می‌شود.</p>
        <h2>بازپرداخت و پشتیبانی</h2>
        <p>{placeholder}</p>
        <h2>حریم خصوصی</h2>
        <p>{placeholder}</p>
      </section>
    </PageShell>
  );
}
