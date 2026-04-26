// All code sending goes through the backend server
// This avoids CORS issues and keeps credentials secure

const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

// ── Send email via backend (Nodemailer/Gmail) ─────────────
export const sendEmailCode = async (toEmail, code) => {
  try {
    const res = await fetch(`${API}/auth/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: toEmail, code }),
    });
    const data = await res.json();
    if (res.ok) return { ok: true, method: data.method || "email" };
    console.error("Email send error:", data.error);
    return { ok: false, error: data.error };
  } catch (err) {
    console.error("Email fetch failed:", err.message);
    return { ok: false, error: "Server offline. Start the backend server." };
  }
};

// ── Send SMS via backend (Twilio or TextBelt) ─────────────
export const sendSMSCode = async (phone, code) => {
  try {
    const res = await fetch(`${API}/auth/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    if (res.ok) return { ok: true, method: data.method || "sms" };
    console.error("SMS send error:", data.error);
    return { ok: false, error: data.error };
  } catch (err) {
    console.error("SMS fetch failed:", err.message);
    return { ok: false, error: "Server offline. Start the backend server." };
  }
};
