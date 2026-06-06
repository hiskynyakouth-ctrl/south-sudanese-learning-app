const LOCAL_API = "http://localhost:5000/api";
const RENDER_API = "https://south-sudanese-learning-app-sqdw.onrender.com/api";

const isVercelApp = () => {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h.endsWith(".vercel.app") || h === "south-sudanese-learning-app-two.vercel.app";
};

export const getApiBaseURL = () => {
  // On Vercel deployment use the Vercel proxy rewrite (/api → Render)
  if (isVercelApp()) return "/api";
  // Explicit env override (e.g. local .env pointing at Render)
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  // Local dev
  if (process.env.NODE_ENV === "development") return LOCAL_API;
  // Production build served from non-Vercel host
  return RENDER_API;
};

export const getAssetBaseURL = () => getApiBaseURL().replace(/\/api\/?$/, "");

/**
 * Wake up the Render free-tier backend.
 * Returns true once the server responds, or false after maxWaitMs.
 */
export const wakeBackend = async (maxWaitMs = 60000) => {
  const base = getApiBaseURL();
  const healthUrl = base.replace(/\/api\/?$/, "") + "/api/health";
  const interval = 4000;
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(healthUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return true;
    } catch {
      // still sleeping — keep polling
    }
    await new Promise(r => setTimeout(r, interval));
  }
  return false;
};
