'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, X, Package } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';
import { InventoryProduct } from '@/lib/types';

export default function InventoryPage() {
  const { data, addInventoryProduct, updateInventoryProduct, deleteInventoryProduct } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Access Restricted</h2>
        <p className="text-gray-500 mt-2">Only administrators can manage the global inventory.</p>
      </div>
    );
  }

  const filtered = data.inventoryProducts.filter(p => {
    const s = search.toLowerCase();
    return (
      p.productName.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold font-display" style={{ color: 'var(--ink)' }}>
            Inventory Management
          </h2>
          <p className="text-gray-500 mt-1">{data.inventoryProducts.length} total products</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="crm-input pl-10" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-surface rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Billing Type</th>
                <th>Unit Price</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No products found.</td></tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id}>
                    <td className="font-semibold" style={{ color: 'var(--ink)' }}>{product.productName}</td>
                    <td><span className="inline-flex px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-600">{product.category}</span></td>
                    <td><span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${product.billingType === 'Monthly Recurring' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{product.billingType || 'One-Off'}</span></td>
                    <td>{formatCurrency(product.unitPrice)}</td>
                    <td>
                      <span className={`font-medium ${product.stockQuantity <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500 max-w-[200px] truncate">{product.description || '—'}</td>
                    <td className="text-xs text-gray-400">{formatDate(product.updatedAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingProduct(product); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => { if (confirm('Delete this product?')) deleteInventoryProduct(product.id); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={p => {
            if (editingProduct) {
              updateInventoryProduct(editingProduct.id, p);
            } else {
              addInventoryProduct(p as Omit<InventoryProduct, 'id' | 'createdAt' | 'updatedAt'>);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: InventoryProduct | null;
  onClose: () => void;
  onSave: (p: Partial<InventoryProduct>) => void;
}) {
  const [form, setForm] = useState({
    productName: product?.productName || '',
    category: product?.category || 'Hardware',
    billingType: product?.billingType || 'One-Off',
    unitPrice: product?.unitPrice?.toString() || '',
    stockQuantity: product?.stockQuantity?.toString() || '0',
    description: product?.description || '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display" style={{ color: 'var(--ink)' }}>
              {product ? 'Edit Product' : 'Add Product'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave({
                ...form,
                unitPrice: Number(form.unitPrice),
                stockQuantity: Number(form.stockQuantity),
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Product Name *</label>
              <input className="crm-input" value={form.productName} onChange={e => set('productName', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Category</label>
                <input className="crm-input" placeholder="e.g. Hardware, Software" value={form.category} onChange={e => set('category', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Billing Type</label>
                <select className="crm-select" value={form.billingType} onChange={e => set('billingType', e.target.value)}>
                  <option value="One-Off">One-Off</option>
                  <option value="Monthly Recurring">Monthly Recurring</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Unit Price (£) *</label>
                <input type="number" step="0.01" className="crm-input" value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Stock Quantity</label>
                <input type="number" className="crm-input" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Description</label>
              <textarea className="crm-textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="btn-primary">{product ? 'Save Changes' : 'Add Product'}</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
