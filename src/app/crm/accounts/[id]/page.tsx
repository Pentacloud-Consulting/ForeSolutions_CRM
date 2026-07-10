'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccount, updateAccount, getLead, getAccountProjects, getAccountContacts } = useData();
  const account = getAccount(params.id as string);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>((account as unknown as Record<string, unknown>) || {});

  if (!account) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Account not found.</p>
        <Link href="/crm/accounts" className="text-blue-500 hover:underline mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  const lead = account.convertedFromLeadId ? getLead(account.convertedFromLeadId) : null;
  const projects = getAccountProjects(account.id);
  const contacts = getAccountContacts(account.id);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateAccount(account.id, form as Partial<typeof account>);
    setEditing(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/crm/accounts')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            {account.clientName}
          </h2>
          <span className="text-xs text-gray-400">Created {formatDate(account.createdAt)}</span>
        </div>
        {!editing ? (
          <button onClick={() => { setForm(account as unknown as Record<string, unknown>); setEditing(true); }} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border" style={{ borderColor: 'var(--border)' }}>
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button onClick={handleSave} className="btn-primary"><Save className="w-4 h-4" /> Save</button>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-surface rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Account Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: 'Client Name', key: 'clientName' },
            { label: 'Mobile', key: 'mobile' },
            { label: 'Alternate Mobile', key: 'alternateMobile' },
            { label: 'Email', key: 'email' },
            { label: 'City', key: 'city' },
            { label: 'State', key: 'state' },
            { label: 'Industry', key: 'industry' },
            { label: 'Website', key: 'website' },
            { label: 'Company Reg No', key: 'companyRegistrationNumber' },
            { label: 'VAT Number', key: 'vatNumber' },
          ].map(f => (
            <div key={f.key}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>{f.label}</div>
              {editing ? (
                <input className="crm-input" value={(form[f.key] as string) || ''} onChange={e => set(f.key, e.target.value)} />
              ) : (
                <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{(account as unknown as Record<string, unknown>)[f.key] as string || '—'}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Address</div>
          {editing ? (
            <textarea className="crm-textarea" value={(form.address as string) || ''} onChange={e => set('address', e.target.value)} rows={2} />
          ) : (
            <div className="text-sm" style={{ color: 'var(--ink)' }}>{account.address || '—'}</div>
          )}
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Notes</div>
          {editing ? (
            <textarea className="crm-textarea" value={(form.notes as string) || ''} onChange={e => set('notes', e.target.value)} rows={2} />
          ) : (
            <div className="text-sm" style={{ color: 'var(--ink)' }}>{account.notes || '—'}</div>
          )}
        </div>
      </div>

      {/* Lookup: Converted From Lead */}
      {lead && (
        <div className="bg-surface rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>
            Converted From Lead
          </h3>
          <div className="lookup-display">
            <div className="lookup-row">
              <div className="lookup-item"><span>Lead Name</span><span>{lead.leadName}</span></div>
              <div className="lookup-item"><span>Mobile</span><span>{lead.mobile}</span></div>
              <div className="lookup-item"><span>Lead Source</span><span>{lead.leadSource}</span></div>
              <div className="lookup-item"><span>Budget</span><span>{formatCurrency(lead.budget)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Related Projects */}
      {projects.length > 0 && (
        <div className="bg-surface rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>
            Linked Projects ({projects.length})
          </h3>
          <div className="space-y-2">
            {projects.map(p => (
              <Link
                key={p.id}
                href={`/crm/projects/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ border: '1px solid var(--border)' }}
              >
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{p.projectId}</span>
                  <span className="text-sm text-gray-500 ml-2">{p.projectName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Contacts */}
      {contacts.length > 0 && (
        <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>
            Linked Contacts ({contacts.length})
          </h3>
          <div className="space-y-2">
            {contacts.map(c => (
              <Link
                key={c.id}
                href={`/crm/contacts/${c.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ border: '1px solid var(--border)' }}
              >
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{c.contactName}</span>
                  <span className="text-sm text-gray-500 ml-2">{c.mobile}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
