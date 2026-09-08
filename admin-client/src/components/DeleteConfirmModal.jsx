import { AlertTriangle, X } from 'lucide-react';

export function DeleteConfirmModal({ product, onCancel, onConfirm }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <section
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
      >
        <header className="modal-header">
          <div>
            <p>PRODUCT MANAGEMENT</p>
            <h2 id="delete-product-title">ยืนยันการลบสินค้า</h2>
          </div>
          <button type="button" onClick={onCancel} aria-label="ปิดหน้าต่างยืนยัน">
            <X size={20} />
          </button>
        </header>

        <div className="confirm-content">
          <div className="confirm-icon" aria-hidden="true">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p id="delete-product-description">
              ต้องการลบสินค้า <strong>“{product.name}”</strong> ใช่หรือไม่?
            </p>
            <small>เมื่อลบแล้วจะไม่สามารถย้อนกลับได้</small>
          </div>
        </div>

        <footer className="confirm-actions">
          <button type="button" className="cancel-action" onClick={onCancel}>
            ยกเลิก
          </button>
          <button type="button" className="delete-action" onClick={onConfirm}>
            ลบสินค้า
          </button>
        </footer>
      </section>
    </div>
  );
}
