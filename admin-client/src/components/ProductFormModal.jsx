import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const emptyVariant = () => ({
  id: crypto.randomUUID(),
  sku: '',
  color: '',
  colorCode: '',
  size: 'S',
  price: '',
  stockQuantity: '',
});

const initialForm = () => ({
  name: '',
  description: '',
  category: 'tops',
  gender: 'unisex',
  tags: '',
  imageUrl: '',
  variants: [emptyVariant()],
});

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อสินค้า';
  if (!form.description.trim()) errors.description = 'กรุณากรอกรายละเอียดสินค้า';

  form.variants.forEach((variant, index) => {
    if (!variant.sku.trim()) errors[`variant-${index}-sku`] = 'กรุณากรอก SKU';
    if (!variant.color.trim()) errors[`variant-${index}-color`] = 'กรุณากรอกสี';
    if (Number(variant.price) <= 0) errors[`variant-${index}-price`] = 'ราคาต้องมากกว่า 0';
    if (variant.stockQuantity === '' || Number(variant.stockQuantity) < 0) {
      errors[`variant-${index}-stock`] = 'สต็อกต้องเป็น 0 หรือมากกว่า';
    }
  });

  return errors;
};

export function ProductFormModal({ onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateVariant = (index, field, value) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      ),
    }));
    setErrors((current) => ({ ...current, [`variant-${index}-${field === 'stockQuantity' ? 'stock' : field}`]: undefined }));
  };

  const removeVariant = (index) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const productId = `product-${Date.now()}`;
    onCreate({
      ...form,
      _id: productId,
      productId,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      variants: form.variants.map(({ id, ...variant }) => ({
        ...variant,
        _id: `${productId}-${variant.sku.toLowerCase()}`,
        price: Number(variant.price),
        stockQuantity: Number(variant.stockQuantity),
      })),
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="create-product-title">
        <header className="modal-header">
          <div>
            <p>PRODUCT MANAGEMENT</p>
            <h2 id="create-product-title">เพิ่มสินค้าใหม่</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="ปิดฟอร์มเพิ่มสินค้า"><X size={20} /></button>
        </header>

        <form className="product-form" onSubmit={submit} noValidate>
          <div className="form-grid">
            <label className="field full-width">
              <span>ชื่อสินค้า <b>*</b></span>
              <input ref={nameInputRef} value={form.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>

            <label className="field full-width">
              <span>รายละเอียดสินค้า <b>*</b></span>
              <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows="3" aria-invalid={Boolean(errors.description)} />
              {errors.description && <small className="field-error">{errors.description}</small>}
            </label>

            <label className="field">
              <span>หมวดหมู่</span>
              <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
                <option value="tops">เสื้อ (Tops)</option>
                <option value="bottoms">กางเกง (Bottoms)</option>
              </select>
            </label>

            <label className="field">
              <span>เพศ</span>
              <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)}>
                <option value="unisex">Unisex</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </label>

            <label className="field">
              <span>Tags</span>
              <input value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="casual, minimal" />
            </label>

            <label className="field">
              <span>Image URL</span>
              <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="/collection-2026/products/..." />
            </label>
          </div>

          <div className="variant-heading">
            <div>
              <h3>ตัวเลือกสินค้า (Variants)</h3>
              <p>กำหนด SKU สี ไซซ์ ราคา และจำนวนสินค้า</p>
            </div>
            <button type="button" className="secondary-action" onClick={() => setForm((current) => ({ ...current, variants: [...current.variants, emptyVariant()] }))}>
              <Plus size={15} /> เพิ่ม Variant
            </button>
          </div>

          <div className="variant-list">
            {form.variants.map((variant, index) => (
              <fieldset className="variant-card" key={variant.id}>
                <legend>Variant {index + 1}</legend>
                <div className="variant-grid">
                  <label className="field"><span>SKU *</span><input value={variant.sku} onChange={(event) => updateVariant(index, 'sku', event.target.value)} aria-invalid={Boolean(errors[`variant-${index}-sku`])} />{errors[`variant-${index}-sku`] && <small className="field-error">{errors[`variant-${index}-sku`]}</small>}</label>
                  <label className="field"><span>สี *</span><input value={variant.color} onChange={(event) => updateVariant(index, 'color', event.target.value)} aria-invalid={Boolean(errors[`variant-${index}-color`])} />{errors[`variant-${index}-color`] && <small className="field-error">{errors[`variant-${index}-color`]}</small>}</label>
                  <label className="field"><span>รหัสสี</span><input value={variant.colorCode} onChange={(event) => updateVariant(index, 'colorCode', event.target.value)} placeholder="OW" /></label>
                  <label className="field"><span>ไซซ์</span><select value={variant.size} onChange={(event) => updateVariant(index, 'size', event.target.value)}><option>S</option><option>M</option><option>L</option></select></label>
                  <label className="field"><span>ราคา *</span><input type="number" min="1" value={variant.price} onChange={(event) => updateVariant(index, 'price', event.target.value)} aria-invalid={Boolean(errors[`variant-${index}-price`])} />{errors[`variant-${index}-price`] && <small className="field-error">{errors[`variant-${index}-price`]}</small>}</label>
                  <label className="field"><span>Stock *</span><input type="number" min="0" value={variant.stockQuantity} onChange={(event) => updateVariant(index, 'stockQuantity', event.target.value)} aria-invalid={Boolean(errors[`variant-${index}-stock`])} />{errors[`variant-${index}-stock`] && <small className="field-error">{errors[`variant-${index}-stock`]}</small>}</label>
                </div>
                {form.variants.length > 1 && <button type="button" className="remove-variant" onClick={() => removeVariant(index)}><Trash2 size={14} /> ลบ Variant</button>}
              </fieldset>
            ))}
          </div>

          <footer className="modal-actions">
            <button type="button" className="cancel-action" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="primary-action">บันทึกสินค้า</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
