'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { Contact } from '@/lib/types';
import { formatDate, truncate } from '@/lib/utils';
import { Plus, Search, Eye, Trash2, X } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

export default function ContactsPage() {
  const { data, addContact, deleteContact } = useData();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = data.contacts.filter(c => {
    const s = search.toLowerCase();
    return (
      c.contactName.toLowerCase().includes(s) ||
      c.mobile.includes(s) ||
      c.email.toLowerCase().includes(s)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#0F1C2E', fontFamily: "'Playfair Display', serif" }}>
            Contacts
          </h2>
          <p className="text-gray-500 mt-1">{data.contacts.length} total contacts</p>
        </div>
        <button className="btn-gold" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="crm-input pl-10"
          placeholder="Search by name, mobile, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Account</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No contacts found.</td>
                </tr>
              ) : (
                filtered.map(contact => {
                  const acct = contact.linkedAccountId
                    ? data.accounts.find(a => a.id === contact.linkedAccountId)
                    : null;
                  return (
                    <tr key={contact.id}>
                      <td className="font-medium" style={{ color: '#0F1C2E' }}>{contact.contactName}</td>
                      <td>{contact.mobile}</td>
                      <td className="text-gray-500">{truncate(contact.email, 25)}</td>
                      <td>{contact.designation || '—'}</td>
                      <td>
                        {acct ? (
                          <Link href={`/crm/accounts/${acct.id}`} className="text-sm hover:underline" style={{ color: '#C9A84C' }}>
                            {acct.clientName}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="text-gray-500 text-xs">{formatDate(contact.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/crm/contacts/${contact.id}`} className="p-1.5 rounded-lg hover:bg-gray-100">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <button
                            onClick={() => { if (confirm('Delete?')) deleteContact(contact.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateContactModal
          accounts={data.accounts}
          onClose={() => setShowCreate(false)}
          onCreate={c => { addContact(c); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function CreateContactModal({
  accounts,
  onClose,
  onCreate,
}: {
  accounts: { id: string; clientName: string }[];
  onClose: () => void;
  onCreate: (c: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [form, setForm] = useState({
    contactName: '', mobile: '', email: '', designation: '', address: '',
    linkedAccountId: null as string | null,
    convertedFromLeadId: null as string | null,
  });
  const set = (key: string, val: string | null) => setForm(f => ({ ...f, [key]: val }));

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#0F1C2E', fontFamily: "'Playfair Display', serif" }}>Create Contact</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); onCreate(form); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Contact Name *</label><input className="crm-input" value={form.contactName} onChange={e => set('contactName', e.target.value)} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Mobile *</label><input className="crm-input" value={form.mobile} onChange={e => set('mobile', e.target.value)} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Email</label><input type="email" className="crm-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Designation</label><input className="crm-input" value={form.designation} onChange={e => set('designation', e.target.value)} /></div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Linked Account</label>
                <select className="crm-select" value={form.linkedAccountId || ''} onChange={e => set('linkedAccountId', e.target.value || null)}>
                  <option value="">— None —</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.clientName}</option>)}
                </select>
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: '#0F1C2E' }}>Address</label><textarea className="crm-textarea" value={form.address} onChange={e => set('address', e.target.value)} rows={2} /></div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="btn-gold">Create Contact</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
