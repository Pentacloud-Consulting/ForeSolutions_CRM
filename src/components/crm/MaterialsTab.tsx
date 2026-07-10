'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { MaterialCategory, MaterialUnit } from '@/lib/types';
import { materialCategoryOptions, materialNamesByCategory } from '@/data/materialOptions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Trash2, X } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

const units: MaterialUnit[] = ['Kg','Ton','Bag','Load','Piece','Sq.ft','Box','Litre'];

export default function MaterialsTab({ projectId }: { projectId: string }) {
  const { getProjectMaterials, addMaterial, deleteMaterial } = useData();
  const materials = getProjectMaterials(projectId);
  const [showCreate, setShowCreate] = useState(false);

  // Category rollups
  const categoryTotals: Record<string, number> = {};
  let grandTotal = 0;
  materials.forEach(m => {
    categoryTotals[m.materialCategory] = (categoryTotals[m.materialCategory] || 0) + m.totalAmount;
    grandTotal += m.totalAmount;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Materials ({materials.length})</h3>
        <button className="btn-primary text-sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {/* Category Rollups */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-surface rounded-xl p-5" style={{ border: '1px solid var(--border)' }}>
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Category Totals</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {materialCategoryOptions.map(cat => {
              const val = categoryTotals[cat];
              if (!val) return null;
              return (
                <div key={cat} className="flex justify-between p-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                  <span className="text-xs font-medium text-gray-600">{cat}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{formatCurrency(val)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 flex justify-between font-semibold" style={{ borderTop: '2px solid var(--brand-cyan)' }}>
            <span className="text-sm" style={{ color: 'var(--ink)' }}>Grand Total</span>
            <span className="text-sm" style={{ color: 'var(--brand-cyan)' }}>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Material</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Total</th>
                <th>Date</th>
                <th>Vendor</th>
                <th>Invoice</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-8 text-gray-400">No materials added yet.</td></tr>
              ) : (
                materials.map(m => (
                  <tr key={m.id}>
                    <td className="text-xs">{m.materialCategory}</td>
                    <td className="font-medium" style={{ color: 'var(--ink)' }}>{m.materialName}</td>
                    <td>{m.quantity}</td>
                    <td>{m.unit}</td>
                    <td>{formatCurrency(m.rate)}</td>
                    <td className="font-semibold" style={{ color: 'var(--brand-cyan)' }}>{formatCurrency(m.totalAmount)}</td>
                    <td className="text-xs text-gray-500">{formatDate(m.purchaseDate)}</td>
                    <td className="text-xs">{m.vendorName || '—'}</td>
                    <td className="text-xs">{m.invoiceNumber || '—'}</td>
                    <td>
                      <button onClick={() => { if (confirm('Delete?')) deleteMaterial(m.id); }} className="p-1 rounded hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateMaterialModal
          projectId={projectId}
          onClose={() => setShowCreate(false)}
          onCreate={m => { addMaterial(m); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function CreateMaterialModal({
  projectId, onClose, onCreate,
}: {
  projectId: string;
  onClose: () => void;
  onCreate: (m: Parameters<ReturnType<typeof useData>['addMaterial']>[0]) => void;
}) {
  const [form, setForm] = useState({
    materialCategory: 'Construction Materials' as MaterialCategory,
    materialName: '',
    quantity: '',
    unit: 'Kg' as MaterialUnit,
    rate: '',
    purchaseDate: '',
    vendorName: '',
    invoiceNumber: '',
    billAttachment: '',
    remarks: '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const nameOptions = materialNamesByCategory[form.materialCategory] || [];

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Add Material</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={e => {
            e.preventDefault();
            onCreate({
              projectId,
              materialCategory: form.materialCategory,
              materialName: form.materialName,
              quantity: form.quantity ? Number(form.quantity) : null,
              unit: form.unit,
              rate: form.rate ? Number(form.rate) : null,
              purchaseDate: form.purchaseDate,
              vendorName: form.vendorName,
              invoiceNumber: form.invoiceNumber,
              billAttachment: form.billAttachment,
              remarks: form.remarks,
            });
          }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Category *</label>
                <select className="crm-select" value={form.materialCategory} onChange={e => { set('materialCategory', e.target.value); set('materialName', ''); }}>
                  {materialCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Material Name *</label>
                <select className="crm-select" value={form.materialName} onChange={e => set('materialName', e.target.value)} required>
                  <option value="">— Select —</option>
                  {nameOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Quantity *</label><input type="number" className="crm-input" value={form.quantity} onChange={e => set('quantity', e.target.value)} required /></div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Unit</label>
                <select className="crm-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Rate (₹) *</label><input type="number" className="crm-input" value={form.rate} onChange={e => set('rate', e.target.value)} required /></div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#64748B' }}>Total Amount</label>
                <div className="crm-input bg-gray-50 font-semibold" style={{ color: 'var(--brand-cyan)' }}>
                  {formatCurrency((Number(form.quantity) || 0) * (Number(form.rate) || 0))}
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Purchase Date</label><input type="date" className="crm-input" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Vendor Name</label><input className="crm-input" value={form.vendorName} onChange={e => set('vendorName', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Invoice Number</label><input className="crm-input" value={form.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Bill Attachment</label><input type="file" className="crm-input text-xs" onChange={e => set('billAttachment', e.target.files?.[0]?.name || '')} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Remarks</label><textarea className="crm-textarea" value={form.remarks} onChange={e => set('remarks', e.target.value)} rows={2} /></div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="btn-primary">Add Material</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
