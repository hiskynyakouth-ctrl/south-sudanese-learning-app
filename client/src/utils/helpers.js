export const formatDate = (date) => new Date(date).toLocaleDateString();

export const capitalize = (value = "") =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export const getYoutubeEmbedUrl = (url = "") => {
  if (!url) {
    return "";
  }

  if (url.includes("embed/")) {
    return url;
  }

  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  return url;
};

export const truncate = (value = "", max = 120) =>
  value.length > max ? `${value.slice(0, max).trim()}...` : value;
