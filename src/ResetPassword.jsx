import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./components/Auth.css";

export default function ResetPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
    if (password !== confirm) return setError("تکرار رمز عبور با رمز اصلی مطابقت ندارد.");

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) return setError("تغییر رمز انجام نشد: " + updateError.message);
    setDone(true);
  }

  return (
    <div className="nova-auth-page" dir="rtl">
      <div className="nova-auth-glow"></div>
      <div className="nova-auth-card">
        <div className="nova-auth-logo">NOVA<span> AI</span></div>
        <h1>تعیین رمز عبور جدید</h1>

        {done ? (
          <>
            <div className="nova-auth-message">رمز عبور با موفقیت تغییر کرد.</div>
            <button className="nova-auth-submit" type="button" onClick={onDone}>ادامه</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              رمز عبور جدید
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" minLength={8} required />
            </label>
            <label>
              تکرار رمز عبور
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password" required />
            </label>
            {error && <div className="nova-auth-error">{error}</div>}
            <button className="nova-auth-submit" type="submit" disabled={loading}>
              {loading ? "لطفاً صبر کن..." : "ذخیره رمز جدید"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
