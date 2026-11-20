
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

async function fetchUsers() {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    method: "POST",
  });

  if (error) throw new Error(error.message || "Function request failed");
  if (data?.error) throw new Error(data.error);

  return data?.users ?? [];
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      setUsers(await fetchUsers());
    } catch (err) {
      setError(err.message || "خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    fetchUsers()
      .then((list) => {
        if (active) setUsers(list);
      })
      .catch((err) => {
        if (active) setError(err.message || "خطا در دریافت کاربران");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030817",
      color: "#eaf6ff",
      padding: "32px",
      fontFamily: "Vazirmatn, sans-serif",
      direction: "rtl"
    }}>
      <h1 style={{ color: "#00baff" }}>
        NOVA CONTROL CENTER
      </h1>

      <h2>مدیریت کاربران</h2>

      <button
        onClick={loadUsers}
        style={{
          background: "#087fbd",
          color: "white",
          border: 0,
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        بارگذاری دوباره
      </button>

      {loading && <p>در حال دریافت کاربران...</p>}

      {error && (
        <p style={{ color: "#ff7777" }}>
          خطا: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p>تعداد کاربران: {users.length}</p>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#0b1730"
            }}>
              <thead>
                <tr>
                  {["ایمیل", "شناسه کاربر", "تاریخ ثبت‌نام", "تأیید ایمیل"].map(
                    (title) => (
                      <th key={title} style={{
                        padding: "14px",
                        borderBottom: "1px solid #24415f",
                        textAlign: "right"
                      }}>
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: "14px" }}>
                      {user.email || "—"}
                    </td>
                    <td style={{
                      padding: "14px",
                      fontSize: "12px",
                      direction: "ltr"
                    }}>
                      {user.id}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("fa-IR")
                        : "—"}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {user.email_confirmed_at ? "تأیید شده" : "تأیید نشده"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
