// Google OAuth using popup window — no library needed
// Get your Client ID from: https://console.cloud.google.com/apis/credentials

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {

    // ── Real Google OAuth popup (when Client ID is configured) ─
    if (CLIENT_ID && CLIENT_ID !== "your-google-client-id-here") {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: window.location.origin,
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
      return;
    }

    // ── No Client ID — show form: name + email + password ─────
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;padding:20px;
      font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    `;

    overlay.innerHTML = `
      <div style="
        background:white;border-radius:20px;padding:32px 28px;
        width:min(420px,100%);box-shadow:0 24px 60px rgba(0,0,0,0.25);
        display:grid;gap:0;
      ">
        <!-- Header -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;">
          <svg width="32" height="32" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <div>
            <div style="font-weight:800;font-size:1.05rem;color:#122033;">Sign in with Google</div>
            <div style="font-size:0.78rem;color:#5b6b7d;">Enter your details to continue</div>
          </div>
        </div>

        <!-- Fields -->
        <div style="display:grid;gap:14px;">

          <!-- Name -->
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#122033;margin-bottom:5px;">Full Name</label>
            <input id="g-name" type="text" placeholder="Your full name" autocomplete="name"
              style="width:100%;padding:12px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
              onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'" />
          </div>

          <!-- Email -->
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#122033;margin-bottom:5px;">Gmail Address</label>
            <input id="g-email" type="email" placeholder="yourname@gmail.com" autocomplete="email"
              style="width:100%;padding:12px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
              onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'" />
          </div>

          <!-- Password -->
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#122033;margin-bottom:5px;">Password</label>
            <div style="position:relative;">
              <input id="g-password" type="password" placeholder="Create a password (min 6 chars)" autocomplete="new-password"
                style="width:100%;padding:12px 44px 12px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
                onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'" />
              <button id="g-eye" type="button" style="
                position:absolute;right:12px;top:50%;transform:translateY(-50%);
                background:none;border:none;cursor:pointer;font-size:1rem;padding:0;line-height:1;
              ">👁️</button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#122033;margin-bottom:5px;">Confirm Password</label>
            <input id="g-confirm" type="password" placeholder="Repeat your password" autocomplete="new-password"
              style="width:100%;padding:12px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
              onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'" />
          </div>

          <!-- Error -->
          <div id="g-error" style="color:#c62828;font-size:0.82rem;background:#fff2f2;border:1px solid #ffcdd2;border-radius:10px;padding:10px 12px;display:none;"></div>

          <!-- Submit -->
          <button id="g-submit" style="
            width:100%;padding:13px;
            background:linear-gradient(135deg,#4285f4,#1a73e8);
            color:white;border:none;border-radius:12px;
            font-weight:700;font-size:0.95rem;cursor:pointer;
            transition:opacity 0.15s;
          ">Continue →</button>

          <!-- Cancel -->
          <button id="g-cancel" style="
            width:100%;padding:11px;background:none;
            border:1.5px solid #e0e0e0;border-radius:12px;
            font-weight:600;font-size:0.88rem;cursor:pointer;color:#5b6b7d;
          ">Cancel</button>

        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const nameInput    = overlay.querySelector("#g-name");
    const emailInput   = overlay.querySelector("#g-email");
    const pwInput      = overlay.querySelector("#g-password");
    const confirmInput = overlay.querySelector("#g-confirm");
    const errorDiv     = overlay.querySelector("#g-error");
    const submitBtn    = overlay.querySelector("#g-submit");
    const cancelBtn    = overlay.querySelector("#g-cancel");
    const eyeBtn       = overlay.querySelector("#g-eye");

    nameInput.focus();

    // Toggle password visibility
    eyeBtn.addEventListener("click", () => {
      const isText = pwInput.type === "text";
      pwInput.type = isText ? "password" : "text";
      confirmInput.type = isText ? "password" : "text";
      eyeBtn.textContent = isText ? "👁️" : "🙈";
    });

    const showError = (msg) => {
      errorDiv.textContent = msg;
      errorDiv.style.display = "block";
    };
    const hideError = () => { errorDiv.style.display = "none"; };

    const close = () => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    };

    const submit = () => {
      hideError();
      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim().toLowerCase();
      const pw      = pwInput.value;
      const confirm = confirmInput.value;

      if (!name)  { showError("Please enter your full name."); nameInput.focus(); return; }
      if (!email) { showError("Please enter your Gmail address."); emailInput.focus(); return; }
      if (!email.includes("@") || !email.includes(".")) {
        showError("Please enter a valid email address."); emailInput.focus(); return;
      }
      if (!pw) { showError("Please create a password."); pwInput.focus(); return; }
      if (pw.length < 6) { showError("Password must be at least 6 characters."); pwInput.focus(); return; }
      if (pw !== confirm) { showError("Passwords do not match."); confirmInput.focus(); return; }

      close();
      resolve({
        name,
        email,
        password: pw,
        googleId: `g_${email.replace(/[^a-z0-9]/g, "_")}`,
        picture: null,
      });
    };

    submitBtn.addEventListener("click", submit);
    nameInput.addEventListener("keydown",    e => e.key === "Enter" && emailInput.focus());
    emailInput.addEventListener("keydown",   e => e.key === "Enter" && pwInput.focus());
    pwInput.addEventListener("keydown",      e => e.key === "Enter" && confirmInput.focus());
    confirmInput.addEventListener("keydown", e => e.key === "Enter" && submit());

    cancelBtn.addEventListener("click", () => {
      close();
      reject(new Error("Google login was cancelled."));
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        close();
        reject(new Error("Google login was cancelled."));
      }
    });
  });
};
