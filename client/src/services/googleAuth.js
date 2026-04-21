// Google OAuth using popup window — no library needed
// Get your Client ID from: https://console.cloud.google.com/apis/credentials

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const REDIRECT_URI = window.location.origin;

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID || CLIENT_ID === "your-google-client-id-here") {
      // Demo mode — simulate Google login with a fake profile
      const demoUser = {
        name: "Google User",
        email: `google_${Date.now()}@gmail.com`,
        googleId: `google_${Date.now()}`,
        picture: "https://lh3.googleusercontent.com/a/default-user",
      };
      resolve(demoUser);
      return;
    }

    // Real Google OAuth popup
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "token",
      scope: "openid email profile",
      prompt: "select_account",
    });

    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      "google-login",
      "width=500,height=600,scrollbars=yes"
    );

    const timer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(timer);
          reject(new Error("Google login was cancelled."));
          return;
        }
        const url = popup.location.href;
        if (url.includes("access_token")) {
          clearInterval(timer);
          popup.close();
          const hash = new URLSearchParams(url.split("#")[1]);
          const accessToken = hash.get("access_token");
          // Fetch user info
          fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
            .then(r => r.json())
            .then(profile => resolve({
              name: profile.name,
              email: profile.email,
              googleId: profile.sub,
              picture: profile.picture,
            }))
            .catch(reject);
        }
      } catch {
        // Cross-origin — still loading
      }
    }, 500);
  });
};
