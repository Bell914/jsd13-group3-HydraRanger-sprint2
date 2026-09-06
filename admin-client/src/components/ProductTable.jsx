import { Image, Pencil, Trash2 } from 'lucide-react';

const formatPrice = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

const getSummary = (product) => {
  const variants = product.variants ?? [];
  const totalStock = variants.reduce((total, variant) => total + variant.stockQuantity, 0);
  const prices = variants.map((variant) => variant.price);

  return {
    sku: variants[0]?.sku ?? '-',
    price: prices.length ? Math.min(...prices) : 0,
    totalStock,
    status: totalStock > 0 ? 'พร้อมขาย' : 'สินค้าหมด',
  };
};

export function ProductTable({ products }) {
  return (
    <section className="product-table-card" aria-label="รายการสินค้า">
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อสินค้า / SKU</th>
              <th>หมวดหมู่</th>
              <th>ราคา</th>
              <th>คงเหลือ (Stock)</th>
              <th>สถานะ</th>
              <th className="align-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const summary = getSummary(product);
              return (
                <tr key={product._id ?? product.productId}>
                  <td>
                    <div className="product-thumbnail">
                      <Image size={20} aria-hidden="true" />
                    </div>
                  </td>
                  <td>
                    <strong className="product-name">{product.name}</strong>
                    <small>SKU: {summary.sku}</small>
                  </td>
                  <td className="capitalize">{product.category}</td>
                  <td className="price">{formatPrice.format(summary.price)}</td>
                  <td>
                    <span className={summary.totalStock <= 10 ? 'stock low' : 'stock'}>
                      {summary.totalStock} ตัว
                    </span>
                  </td>
                  <td>
                    <span className={`status ${summary.totalStock > 0 ? 'active' : 'empty'}`}>
                      {summary.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" aria-label={`แก้ไข ${product.name}`} title="แก้ไข" disabled>
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="danger" aria-label={`ลบ ${product.name}`} title="ลบ" disabled>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="table-footer">
        <p>แสดง {products.length} จากทั้งหมด {products.length} รายการ</p>
        <button type="button" className="page-button" aria-current="page">1</button>
      </footer>
    </section>
  );
}
