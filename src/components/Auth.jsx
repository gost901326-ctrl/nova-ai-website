
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Auth.css";

export default function Auth({ onSuccess, onBack }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const isRecovery = mode === "recovery";

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || (!isRecovery && !password)) {
      setError(
        isRecovery
          ? "لطفاً ایمیل خود را وارد کن."
          : "لطفاً ایمیل و رمز عبور را وارد کن."
      );
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setError("لطفاً نام خود را وارد کن.");
        return;
      }

      if (password.length < 8) {
        setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
        return;
      }

      if (password !== confirmPassword) {
        setError("تکرار رمز عبور با رمز اصلی مطابقت ندارد.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (authError) throw authError;

        if (data.session) {
          onSuccess?.(data.session);
        } else {
          setMessage(
            "ثبت‌نام انجام شد. ایمیل خود را بررسی کن و لینک تأیید حساب را باز کن."
          );
          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
      } else if (isRecovery) {
        const { error: recoveryError } =
          await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo:
              window.location.origin + window.location.pathname,
          });

        if (recoveryError) throw recoveryError;

        setMessage(
          "اگر این ایمیل حسابی داشته باشد، لینک بازیابی رمز برای آن ارسال می‌شود."
        );
      } else {
        const { data, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (loginError) throw loginError;

        onSuccess?.(data.session);
      }
    } catch (err) {
      setError(
        err.message || "عملیات انجام نشد. دوباره تلاش کن."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nova-auth-page" dir="rtl">
      <div className="nova-auth-glow"></div>

      <button
        type="button"
        className="nova-auth-back"
        onClick={onBack}
      >
        ← بازگشت به سایت
      </button>

      <div className="nova-auth-card">
        <div className="nova-auth-logo">
          NOVA<span> AI</span>
        </div>

        <div className="nova-auth-tag">
          ✦ YOUR PERSONAL AI SPACE
        </div>

        <h1>
          {isSignup
            ? "ساخت حساب کاربری"
            : isRecovery
              ? "بازیابی رمز عبور"
              : "خوش آمدی"}
        </h1>

        <p className="nova-auth-subtitle">
          {isSignup
            ? "به خانواده NOVA AI بپیوند."
            : isRecovery
              ? "لینک بازیابی را به ایمیل خود دریافت کن."
              : "برای ورود به فضای اختصاصی NOVA وارد شو."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              نام کامل
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="نام خود را وارد کن"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            ایمیل
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
            />
          </label>

          {!isRecovery && (
            <label>
              رمز عبور
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                minLength={8}
                required
              />
            </label>
          )}

          {isSignup && (
            <label>
              تکرار رمز عبور
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="رمز عبور را دوباره وارد کن"
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {error && (
            <div className="nova-auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="nova-auth-message">
              {message}
            </div>
          )}

          <button
            className="nova-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "لطفاً صبر کن..."
              : isSignup
                ? "ایجاد حساب"
                : isRecovery
                  ? "ارسال لینک بازیابی"
                  : "ورود به حساب"}
          </button>
        </form>

        {!isSignup && !isRecovery && (
          <button
            type="button"
            className="nova-auth-text-button"
            onClick={() => changeMode("recovery")}
          >
            رمز عبورت را فراموش کرده‌ای؟
          </button>
        )}

        <div className="nova-auth-divider"></div>

        {isRecovery ? (
          <button
            type="button"
            className="nova-auth-switch"
            onClick={() => changeMode("login")}
          >
            بازگشت به ورود
          </button>
        ) : (
          <p className="nova-auth-switch">
            {isSignup
              ? "قبلاً حساب ساخته‌ای؟"
              : "حساب کاربری نداری؟"}

            <button
              type="button"
              onClick={() =>
                changeMode(isSignup ? "login" : "signup")
              }
            >
              {isSignup ? "ورود" : "ثبت‌نام"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
