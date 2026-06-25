'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { Account } from '@/lib/types';
import { formatDate, truncate } from '@/lib/utils';
import { Plus, Search, Eye, Trash2, X } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

export default function AccountsPage() {
  const { data, addAccount, deleteAccount } = useData();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = data.accounts.filter(a => {
    const s = search.toLowerCase();
    return (
      a.clientName.toLowerCase().includes(s) ||
      a.mobile.includes(s) ||
      a.email.toLowerCase().includes(s) ||
      a.city.toLowerCase().includes(s)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#0F1C2E', fontFamily: "'Playfair Display', serif" }}>
            Accounts
          </h2>
          <p className="text-gray-500 mt-1">{data.accounts.length} total accounts</p>
        </div>
        <button className="btn-gold" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="crm-input pl-10"
          placeholder="Search by name, mobile, email, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>City</th>
                <th>GST Number</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No accounts found.</td>
                </tr>
              ) : (
                filtered.map(account => (
                  <tr key={account.id}>
                    <td className="font-medium" style={{ color: '#0F1C2E' }}>{account.clientName}</td>
                    <td>{account.mobile}</td>
                    <td className="text-gray-500">{truncate(account.email, 25)}</td>
                    <td>{account.city}</td>
                    <td className="text-gray-500">{account.gstNumber || '—'}</td>
                    <td className="text-gray-500 text-xs">{formatDate(account.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/crm/accounts/${account.id}`} className="p-1.5 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500" /></Link>
                        <button onClick={() => { if (confirm('Delete?')) deleteAccount(account.id); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateAccountModal
          onClose={() => setShowCreate(false)}
          onCreate={acct => { addAccount(acct); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function CreateAccountModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (a: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [form, setForm] = useState({
    clientName: '', mobile: '', alternateMobile: '', email: '',
    address: '', city: '', state: '', gstNumber: '', panNumber: '',
    aadhaarNumber: '', notes: '', convertedFromLeadId: null as string | null,
  });
  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#0F1C2E', fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); onCreate(form); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Client Name *</label><input className="crm-input" value={form.clientName} onChange={e => set('clientName', e.target.value)} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Mobile *</label><input className="crm-input" value={form.mobile} onChange={e => set('mobile', e.target.value)} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Alternate Mobile</label><input className="crm-input" value={form.alternateMobile} onChange={e => set('alternateMobile', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Email</label><input type="email" className="crm-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>City</label><input className="crm-input" value={form.city} onChange={e => set('city', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>State</label><input className="crm-input" value={form.state} onChange={e => set('state', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>GST Number</label><input className="crm-input" value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>PAN Number</label><input className="crm-input" value={form.panNumber} onChange={e => set('panNumber', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Aadhaar Number</label><input className="crm-input" value={form.aadhaarNumber} onChange={e => set('aadhaarNumber', e.target.value)} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Address</label><textarea className="crm-textarea" value={form.address} onChange={e => set('address', e.target.value)} rows={2} /></div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Notes</label><textarea className="crm-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="btn-gold">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
