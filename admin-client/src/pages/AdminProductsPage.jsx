import { Bell, Filter, Menu, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductTable } from '../components/ProductTable.jsx';
import { products } from '../data/products.js';

export function AdminProductsPage({ user, onOpenSidebar }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.variants.some((variant) => variant.sku.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <button type="button" className="mobile-menu" onClick={onOpenSidebar} aria-label="เปิดเมนู">
          <Menu size={20} />
        </button>
        <div className="topbar-search">
          <Search size={15} aria-hidden="true" />
          <input type="search" placeholder="ค้นหาข้อมูลระบบ..." aria-label="ค้นหาข้อมูลระบบ" />
        </div>
        <div className="admin-profile">
          <button type="button" className="notification" aria-label="การแจ้งเตือน">
            <Bell size={18} />
            <span />
          </button>
          <strong>{user?.username ?? 'Admin'} (Super Admin)</strong>
        </div>
      </header>

      <main className="products-page">
        <header className="page-heading">
          <div>
            <h1>จัดการสินค้าทั้งหมด (Products)</h1>
            <p>จัดการคลังสินค้า เพิ่ม แก้ไข และตรวจสอบสถานะสินค้าในระบบ</p>
          </div>
          <button type="button" className="primary-action" disabled>
            <Plus size={16} /> เพิ่มสินค้าใหม่
          </button>
        </header>

        <section className="filter-toolbar" aria-label="ค้นหาและกรองสินค้า">
          <label className="product-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">ค้นหาชื่อสินค้าหรือ SKU</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาชื่อสินค้า, SKU..."
            />
          </label>
          <div className="filters">
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="กรองตามหมวดหมู่">
              <option value="all">ทุกหมวดหมู่ (Categories)</option>
              <option value="tops">เสื้อ (Tops)</option>
              <option value="bottoms">กางเกง (Bottoms)</option>
            </select>
            <button type="button" className="filter-button" disabled>
              <Filter size={15} /> ตัวกรอง
            </button>
          </div>
        </section>

        <ProductTable products={visibleProducts} />
      </main>
    </div>
  );
}
