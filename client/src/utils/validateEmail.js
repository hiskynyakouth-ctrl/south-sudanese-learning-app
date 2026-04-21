// Accepted email providers only — unknown domains are blocked

const ALLOWED_DOMAINS = [
  // Google
  "gmail.com","googlemail.com",
  // Microsoft
  "outlook.com","hotmail.com","hotmail.co.uk","live.com","live.co.uk","msn.com","windowslive.com",
  // Yahoo
  "yahoo.com","yahoo.co.uk","yahoo.fr","yahoo.de","yahoo.es","yahoo.it","yahoo.com.au","ymail.com",
  // Apple
  "icloud.com","me.com","mac.com",
  // Other major providers
  "protonmail.com","proton.me","tutanota.com","tutanota.de","tuta.io",
  "zoho.com","fastmail.com","fastmail.fm","mail.com","email.com",
  "aol.com","aim.com","yandex.com","yandex.ru","gmx.com","gmx.net","gmx.de",
  "inbox.com","hushmail.com","mailfence.com","disroot.org",
  // Education / South Sudan
  "edu.ss","gov.ss","org.ss","net.ss","school.ss","uni.ss",
  "edu.com","school.com","university.edu",
];

export const validateEmail = (email) => {
  const trimmed = email.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(trimmed)) return { valid: false, allowed: false };

  const [local, domain] = trimmed.split("@");
  if (local.length < 2) return { valid: false, allowed: false };

  const parts = domain.split(".");
  if (parts.length < 2) return { valid: false, allowed: false };
  if (parts[parts.length - 1].length < 2) return { valid: false, allowed: false };
  if (parts[parts.length - 2].length < 2) return { valid: false, allowed: false };

  const allowed = ALLOWED_DOMAINS.includes(domain);
  return { valid: true, allowed };
};

export const emailError = (email) => {
  if (!email.trim()) return "Email address is required.";
  const { valid, allowed } = validateEmail(email);
  if (!valid) return "Please enter a valid email address (e.g. yourname@gmail.com).";
  if (!allowed) {
    const domain = email.split("@")[1];
    return `"@${domain}" is not accepted. Please use Gmail, Yahoo, Outlook, iCloud, or another known provider.`;
  }
  return null;
};

// No warnings — unknown domains are hard errors
export const emailWarning = () => null;
