export default function AuthLayout({ children }) {
  return (
    <div className="auth-page-shell">
      <div className="auth-page-panel">{children}</div>
    </div>
  );
}
