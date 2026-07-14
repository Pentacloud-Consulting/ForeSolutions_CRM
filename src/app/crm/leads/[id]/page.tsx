'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { LeadSource, LeadStatus } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  ArrowLeft, Save, RefreshCw, CheckCircle2, ExternalLink, Building2, Contact2, FolderKanban
} from 'lucide-react';

const leadSources: LeadSource[] = ['Referral', 'Walk-in', 'Social Media', 'Website', 'Other'];
const leadStatuses: LeadStatus[] = ['New', 'Contacted', 'Follow Up', 'Site Visit Scheduled', 'Proposal Sent', 'Qualified', 'Lost'];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getLead, updateLead, convertLead } = useData();
  const lead = getLead(params.id as string);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>((lead as unknown as Record<string, unknown>) || {});
  const [convertResult, setConvertResult] = useState<{
    account: { id: string; clientName: string };
    contact: { id: string; contactName: string };
    project: { id: string; projectName: string; projectId: string };
  } | null>(null);

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Lead not found.</p>
        <Link href="/crm/leads" className="text-blue-500 hover:underline mt-2 inline-block">← Back to Leads</Link>
      </div>
    );
  }

  const set = (key: string, value: string | number | null) => setForm((f: Record<string, unknown>) => ({ ...f, [key]: value }));

  const handleSave = () => {
    updateLead(lead.id, {
      leadName: form.leadName as string,
      companyName: form.companyName as string,
      industry: form.industry as string,
      interestedIn: form.interestedIn as string,
      mobile: form.mobile as string,
      alternateMobile: form.alternateMobile as string,
      email: form.email as string,
      address: form.address as string,
      city: form.city as string,

      leadSource: form.leadSource as LeadSource,
      status: form.status as LeadStatus,
      notes: form.notes as string,
    });
    setEditing(false);
  };

  const handleConvert = () => {
    const result = convertLead(lead.id);
    if (result) {
      setConvertResult(result);
    }
  };

  const canConvert = lead.status === 'Qualified';
  const isConverted = lead.status === 'Converted';

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/crm/leads')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            {lead.leadName}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            <span className="text-xs text-gray-400">Created {formatDate(lead.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!editing && (
            <button onClick={() => { setForm(lead as unknown as Record<string, unknown>); setEditing(true); }} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border" style={{ borderColor: 'var(--border)' }}>
              Edit
            </button>
          )}
          {editing && (
            <>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4" /> Save
              </button>
            </>
          )}
          {canConvert && !convertResult && (
            <button onClick={handleConvert} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Convert Lead
            </button>
          )}
        </div>
      </div>

      {/* Conversion Success */}
      {convertResult && (
        <div className="mb-6 p-6 rounded-xl" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Lead Converted Successfully!</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">The following records have been created:</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href={`/crm/accounts/${convertResult.account.id}`}
              className="flex items-center gap-3 p-4 bg-surface rounded-lg hover:shadow-md transition-shadow"
              style={{ border: '1px solid var(--border)' }}
            >
              <Building2 className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
              <div>
                <div className="text-xs text-gray-400">Account</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{convertResult.account.clientName}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
            <Link
              href={`/crm/contacts/${convertResult.contact.id}`}
              className="flex items-center gap-3 p-4 bg-surface rounded-lg hover:shadow-md transition-shadow"
              style={{ border: '1px solid var(--border)' }}
            >
              <Contact2 className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
              <div>
                <div className="text-xs text-gray-400">Contact</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{convertResult.contact.contactName}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
            <Link
              href={`/crm/projects/${convertResult.project.id}`}
              className="flex items-center gap-3 p-4 bg-surface rounded-lg hover:shadow-md transition-shadow"
              style={{ border: '1px solid var(--border)' }}
            >
              <FolderKanban className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
              <div>
                <div className="text-xs text-gray-400">Deal</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                  {convertResult.project.projectId} — {convertResult.project.projectName}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
          </div>
        </div>
      )}

      {/* Detail Fields */}
      <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Lead Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Lead Name" value={editing ? undefined : lead.leadName}>
            {editing && <input className="crm-input" value={(form.leadName as string) || ''} onChange={e => set('leadName', e.target.value)} />}
          </Field>
          <Field label="Company Name" value={editing ? undefined : lead.companyName}>
            {editing && <input className="crm-input" value={(form.companyName as string) || ''} onChange={e => set('companyName', e.target.value)} />}
          </Field>
          <Field label="Industry" value={editing ? undefined : lead.industry}>
            {editing && <input className="crm-input" value={(form.industry as string) || ''} onChange={e => set('industry', e.target.value)} />}
          </Field>
          <Field label="Interested In" value={editing ? undefined : lead.interestedIn}>
            {editing && <input className="crm-input" value={(form.interestedIn as string) || ''} onChange={e => set('interestedIn', e.target.value)} />}
          </Field>
          <Field label="Mobile" value={editing ? undefined : lead.mobile}>
            {editing && <input className="crm-input" value={(form.mobile as string) || ''} onChange={e => set('mobile', e.target.value)} />}
          </Field>
          <Field label="Alternate Mobile" value={editing ? undefined : lead.alternateMobile}>
            {editing && <input className="crm-input" value={(form.alternateMobile as string) || ''} onChange={e => set('alternateMobile', e.target.value)} />}
          </Field>
          <Field label="Email" value={editing ? undefined : lead.email}>
            {editing && <input className="crm-input" value={(form.email as string) || ''} onChange={e => set('email', e.target.value)} />}
          </Field>
          <Field label="City" value={editing ? undefined : lead.city}>
            {editing && <input className="crm-input" value={(form.city as string) || ''} onChange={e => set('city', e.target.value)} />}
          </Field>

          <Field label="Lead Source" value={editing ? undefined : lead.leadSource}>
            {editing && (
              <select className="crm-select" value={(form.leadSource as string) || ''} onChange={e => set('leadSource', e.target.value)}>
                {leadSources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </Field>
          <Field label="Status" value={editing ? undefined : lead.status}>
            {editing && (
              <select className="crm-select" value={(form.status as string) || ''} onChange={e => set('status', e.target.value)}>
                {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Address" value={editing ? undefined : (lead.address || '—')}>
            {editing && <textarea className="crm-textarea" value={(form.address as string) || ''} onChange={e => set('address', e.target.value)} rows={2} />}
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Notes" value={editing ? undefined : (lead.notes || '—')}>
            {editing && <textarea className="crm-textarea" value={(form.notes as string) || ''} onChange={e => set('notes', e.target.value)} rows={2} />}
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
        {label}
      </div>
      {children || <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value || '—'}</div>}
    </div>
  );
}
