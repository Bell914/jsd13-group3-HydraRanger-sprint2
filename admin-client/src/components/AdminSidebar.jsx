import { LayoutDashboard, LogOut, Package, ShoppingBag, Users, X } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, disabled: true },
  { id: 'customers', label: 'Customers', icon: Users, disabled: true },
];

export function AdminSidebar({ activePage, isOpen, onClose, onNavigate, onLogout }) {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="เมนูผู้ดูแลระบบ">
      <header className="sidebar-brand">
        <div className="admin-avatar">ADMIN</div>
        <div>
          <strong>OCCASION</strong>
          <small>Admin Control Panel</small>
        </div>
        <button type="button" className="sidebar-close" onClick={onClose} aria-label="ปิดเมนู">
          <X size={20} />
        </button>
      </header>

      <nav className="sidebar-nav" aria-label="เมนูหลัก">
        <p className="nav-group-label">ภาพรวม (Overview)</p>
        {menuItems.map(({ id, label, icon: Icon, disabled }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-link ${activePage === id ? 'active' : ''}`}
            onClick={() => !disabled && onNavigate(id)}
            disabled={disabled}
            aria-current={activePage === id ? 'page' : undefined}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        <LogOut size={17} /> ออกจากระบบ
      </button>
    </aside>
  );
}
