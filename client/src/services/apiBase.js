const LOCAL_API = "http://localhost:5000/api";

const isVercelApp = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith(".vercel.app");
};

export const getApiBaseURL = () => {
  if (isVercelApp()) return "/api";
  return process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "development" ? LOCAL_API : "/api");
};

export const getAssetBaseURL = () => getApiBaseURL().replace(/\/api\/?$/, "");
