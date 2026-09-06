import React, { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar.jsx';
import { AdminProductsPage } from './pages/AdminProductsPage.jsx';
import { adminAuthService } from './services/adminAuthService.js';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      onLogin(await adminAuthService.login(credentials));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark"><LockKeyhole size={26} /></div>
        <p className="eyebrow">SECURE BACK OFFICE</p>
        <h1>OCCASION Admin</h1>
        <p className="muted">สำหรับผู้ดูแลระบบเท่านั้น ลูกค้าไม่สามารถเข้าสู่ระบบจากหน้านี้ได้</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={submit}>
          <label>Admin email</label>
          <input
            type="email"
            autoComplete="username"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <button disabled={loading}>{loading ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ Admin'}</button>
        </form>
      </section>
    </main>
  );
};

export default function App() {
  const [user, setUser] = useState(adminAuthService.getUser());
  const [checking, setChecking] = useState(Boolean(adminAuthService.getToken()));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!adminAuthService.getToken()) return;
    adminAuthService.verify()
      .then(setUser)
      .catch(() => {
        adminAuthService.logout();
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="checking">กำลังตรวจสอบสิทธิ์ Admin…</div>;
  if (!user) return <Login onLogin={setUser} />;
  return (
    <div className="admin-shell">
      {sidebarOpen && <button type="button" className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="ปิดเมนู" />}
      <AdminSidebar
        activePage="products"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => {
          setSidebarOpen(false);
        }}
        onLogout={() => {
          adminAuthService.logout();
          setUser(null);
        }}
      />
      <AdminProductsPage user={user} onOpenSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}
