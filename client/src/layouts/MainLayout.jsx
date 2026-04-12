import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">{children}</main>
    </div>
  );
}
