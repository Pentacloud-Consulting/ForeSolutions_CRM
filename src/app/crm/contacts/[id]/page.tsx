'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Save } from 'lucide-react';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContact, updateContact, getAccount, getLead, data } = useData();
  const contact = getContact(params.id as string);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>((contact as unknown as Record<string, unknown>) || {});

  if (!contact) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Contact not found.</p>
        <Link href="/crm/contacts" className="text-blue-500 hover:underline mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  const account = contact.linkedAccountId ? getAccount(contact.linkedAccountId) : null;
  const lead = contact.convertedFromLeadId ? getLead(contact.convertedFromLeadId) : null;

  const set = (key: string, val: string | null) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateContact(contact.id, form as Partial<typeof contact>);
    setEditing(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/crm/contacts')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            {contact.contactName}
          </h2>
          <span className="text-xs text-gray-400">Created {formatDate(contact.createdAt)}</span>
        </div>
        {!editing ? (
          <button onClick={() => { setForm(contact as unknown as Record<string, unknown>); setEditing(true); }} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border" style={{ borderColor: 'var(--border)' }}>Edit</button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button onClick={handleSave} className="btn-primary"><Save className="w-4 h-4" /> Save</button>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-surface rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: 'Contact Name', key: 'contactName' },
            { label: 'Mobile', key: 'mobile' },
            { label: 'Email', key: 'email' },
            { label: 'Designation', key: 'designation' },
          ].map(f => (
            <div key={f.key}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>{f.label}</div>
              {editing ? (
                <input className="crm-input" value={(form[f.key] as string) || ''} onChange={e => set(f.key, e.target.value)} />
              ) : (
                <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{(contact as unknown as Record<string, unknown>)[f.key] as string || '—'}</div>
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Linked Account</div>
            {editing ? (
              <select className="crm-select" value={(form.linkedAccountId as string) || ''} onChange={e => set('linkedAccountId', e.target.value || null)}>
                <option value="">— None —</option>
                {data.accounts.map(a => <option key={a.id} value={a.id}>{a.clientName}</option>)}
              </select>
            ) : (
              account ? (
                <Link href={`/crm/accounts/${account.id}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--brand-cyan)' }}>
                  {account.clientName}
                </Link>
              ) : (
                <div className="text-sm text-gray-400">—</div>
              )
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Address</div>
          {editing ? (
            <textarea className="crm-textarea" value={(form.address as string) || ''} onChange={e => set('address', e.target.value)} rows={2} />
          ) : (
            <div className="text-sm" style={{ color: 'var(--ink)' }}>{contact.address || '—'}</div>
          )}
        </div>
      </div>

      {/* Lookup: Linked Account */}
      {account && (
        <div className="bg-surface rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>
            Linked Account Details
          </h3>
          <div className="lookup-display">
            <div className="lookup-row">
              <div className="lookup-item"><span>Client Name</span><span>{account.clientName}</span></div>
              <div className="lookup-item"><span>Mobile</span><span>{account.mobile}</span></div>
              <div className="lookup-item"><span>Email</span><span>{account.email}</span></div>
              <div className="lookup-item"><span>City</span><span>{account.city}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Lookup: Converted From Lead */}
      {lead && (
        <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>
            Converted From Lead
          </h3>
          <div className="lookup-display">
            <div className="lookup-row">
              <div className="lookup-item"><span>Lead Name</span><span>{lead.leadName}</span></div>
              <div className="lookup-item"><span>Mobile</span><span>{lead.mobile}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
