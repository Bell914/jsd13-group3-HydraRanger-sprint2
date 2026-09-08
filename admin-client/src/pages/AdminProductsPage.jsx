import { Bell, Filter, Menu, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ProductTable } from '../components/ProductTable.jsx';
import { ProductFormModal } from '../components/ProductFormModal.jsx';
import { products } from '../data/products.js';

export function AdminProductsPage({ user, onOpenSidebar }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [productList, setProductList] = useState(() => products);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const searchText = search.trim().toLowerCase();

  const visibleProducts = productList.filter((product) => {
    const isCorrectCategory = category === 'all' || product.category === category;
    const productName = product.name.toLowerCase();
    const isNameMatch = productName.includes(searchText);
    const isSkuMatch = product.variants.some((variant) => {
      return variant.sku.toLowerCase().includes(searchText);
    });

    return isCorrectCategory && (isNameMatch || isSkuMatch);
  });

  const saveProduct = (product) => {
    if (selectedProduct) {
      const updatedProducts = productList.map((item) => {
        if (item._id === selectedProduct._id) {
          return product;
        }
        return item;
      });
      setProductList(updatedProducts);
      setSuccessMessage(`แก้ไขสินค้า “${product.name}” เรียบร้อยแล้ว`);
    } else {
      setProductList([product, ...productList]);
      setSuccessMessage(`เพิ่มสินค้า “${product.name}” เรียบร้อยแล้ว`);
    }
    setSelectedProduct(null);
    setFormOpen(false);
  };

  const openCreateForm = () => {
    setSuccessMessage('');
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setSuccessMessage('');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setSelectedProduct(null);
    setFormOpen(false);
  };

  const changeSearch = (event) => {
    setSearch(event.target.value);
  };

  const changeCategory = (event) => {
    setCategory(event.target.value);
  };

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
          <button type="button" className="primary-action" onClick={openCreateForm}>
            <Plus size={16} /> เพิ่มสินค้าใหม่
          </button>
        </header>

        {successMessage && (
          <p
            className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700"
            role="status"
          >
            {successMessage}
          </p>
        )}

        <section className="filter-toolbar" aria-label="ค้นหาและกรองสินค้า">
          <label className="product-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">ค้นหาชื่อสินค้าหรือ SKU</span>
            <input
              type="search"
              value={search}
              onChange={changeSearch}
              placeholder="ค้นหาชื่อสินค้า, SKU..."
            />
          </label>
          <div className="filters">
            <select value={category} onChange={changeCategory} aria-label="กรองตามหมวดหมู่">
              <option value="all">ทุกหมวดหมู่ (Categories)</option>
              <option value="tops">เสื้อ (Tops)</option>
              <option value="bottoms">กางเกง (Bottoms)</option>
            </select>
            <button type="button" className="filter-button" disabled>
              <Filter size={15} /> ตัวกรอง
            </button>
          </div>
        </section>

        <ProductTable products={visibleProducts} onEdit={openEditForm} />
      </main>
      {formOpen && (
        <ProductFormModal product={selectedProduct} onClose={closeForm} onSave={saveProduct} />
      )}
    </div>
  );
}
