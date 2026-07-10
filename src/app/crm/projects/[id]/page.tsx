'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Save } from 'lucide-react';
import { DealType, ProjectStatus } from '@/lib/types';
import DealInventorySection from '@/components/crm/DealInventorySection';
const dealTypes: DealType[] = ['Hardware', 'Software License', 'Service Contract', 'Blended'];
const projectStatuses: ProjectStatus[] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProject, getAccount, getContact, getLead, data } = useData();
  const project = getProject(params.id as string);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>((project as unknown as Record<string, unknown>) || {});

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Project not found.</p>
        <Link href="/crm/projects" className="text-blue-500 hover:underline mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  const account = project.accountId ? getAccount(project.accountId) : null;
  const contact = project.contactId ? getContact(project.contactId) : null;
  const lead = project.convertedFromLeadId ? getLead(project.convertedFromLeadId) : null;

  const set = (key: string, val: string | boolean | null) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateProject(project.id, {
      projectName: form.projectName as string,
      dealType: form.dealType as DealType,
      contractTermMonths: form.contractTermMonths ? Number(form.contractTermMonths) : null,
      expectedCloseDate: form.expectedCloseDate as string,
      startDate: form.startDate as string,
      endDate: form.endDate as string,
      dealValue: form.dealValue ? Number(form.dealValue) : null,
      status: form.status as ProjectStatus,
      isActive: form.isActive !== false,
      accountId: (form.accountId as string) || null,
      contactId: (form.contactId as string) || null,
    });
    setEditing(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <button onClick={() => router.push('/crm/projects')} className="p-2 rounded-lg hover:bg-gray-100 self-start">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-mono font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--brand-cyan)' }}>
              {project.projectId}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'var(--ink)' }}>
              {project.projectName}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>{project.status}</span>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${project.isActive !== false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
              {project.isActive !== false ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs text-gray-400">Created {formatDate(project.createdAt)}</span>
          </div>
        </div>
        {!editing && (
          <button onClick={() => { setForm(project as unknown as Record<string, unknown>); setEditing(true); }} className="self-start sm:self-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border" style={{ borderColor: 'var(--border)' }}>Edit</button>
        )}
        {editing && (
          <div className="flex gap-3 self-start sm:self-center">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button onClick={handleSave} className="btn-primary"><Save className="w-4 h-4" /> Save</button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6 mt-6">
        <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Deal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Deal Name" value={editing ? undefined : project.projectName}>
              {editing && <input className="crm-input" value={(form.projectName as string)||''} onChange={e => set('projectName', e.target.value)} />}
            </Field>
            <Field label="Deal Type" value={editing ? undefined : project.dealType}>
                {editing && <select className="crm-select" value={(form.dealType as string)||''} onChange={e => set('dealType', e.target.value)}>{dealTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>}
              </Field>
              <Field label="Status" value={editing ? undefined : project.status}>
                {editing && <select className="crm-select" value={(form.status as string)||''} onChange={e => set('status', e.target.value)}>{projectStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>}
              </Field>
              <Field label="Active Status" value={editing ? undefined : (project.isActive !== false ? 'Active' : 'Inactive')}>
                {editing && (
                  <select className="crm-select" value={(form.isActive !== false).toString()} onChange={e => set('isActive', e.target.value === 'true' ? true : false)}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                )}
              </Field>
              <Field label="Account" value={editing ? undefined : (account?.clientName || '—')}>
                {editing && <select className="crm-select" value={(form.accountId as string)||''} onChange={e => set('accountId', e.target.value||null)}><option value="">— None —</option>{data.accounts.map(a => <option key={a.id} value={a.id}>{a.clientName}</option>)}</select>}
              </Field>
              <Field label="Contact" value={editing ? undefined : (contact?.contactName || '—')}>
                {editing && <select className="crm-select" value={(form.contactId as string)||''} onChange={e => set('contactId', e.target.value||null)}><option value="">— None —</option>{data.contacts.map(c => <option key={c.id} value={c.id}>{c.contactName}</option>)}</select>}
              </Field>
              <Field label="Expected Close Date" value={editing ? undefined : formatDate(project.expectedCloseDate)}>
                {editing && <input type="date" className="crm-input" value={(form.expectedCloseDate as string)||''} onChange={e => set('expectedCloseDate', e.target.value)} />}
              </Field>
              <Field label="Contract Term (Months)" value={editing ? undefined : (project.contractTermMonths?.toString() || '—')}>
                {editing && <input type="number" className="crm-input" value={(form.contractTermMonths as string)||''} onChange={e => set('contractTermMonths', e.target.value)} />}
              </Field>
              <Field label="Deal Value" value={editing ? undefined : formatCurrency(project.dealValue)}>
                {editing && <input type="number" className="crm-input" value={(form.dealValue as string)||''} onChange={e => set('dealValue', e.target.value)} />}
              </Field>
              <Field label="Start Date" value={editing ? undefined : formatDate(project.startDate)}>
                {editing && <input type="date" className="crm-input" value={(form.startDate as string)||''} onChange={e => set('startDate', e.target.value)} />}
              </Field>
              <Field label="End Date" value={editing ? undefined : formatDate(project.endDate)}>
                {editing && <input type="date" className="crm-input" value={(form.endDate as string)||''} onChange={e => set('endDate', e.target.value)} />}
              </Field>
            </div>
          </div>

          {/* Lookup Displays */}
          {account && (
            <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Account Details (Lookup)</h3>
              <div className="lookup-display">
                <div className="lookup-row">
                  <div className="lookup-item"><span>Client Name</span><span>{account.clientName}</span></div>
                  <div className="lookup-item"><span>Mobile</span><span>{account.mobile}</span></div>
                  <div className="lookup-item"><span>Email</span><span>{account.email}</span></div>
                  <div className="lookup-item"><span>City</span><span>{account.city}</span></div>
                  <div className="lookup-item"><span>VAT Number</span><span>{account.vatNumber || '—'}</span></div>
                  <div className="lookup-item"><span>Company Reg No</span><span>{account.companyRegistrationNumber || '—'}</span></div>
                </div>
              </div>
            </div>
          )}
          {contact && (
            <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Contact Details (Lookup)</h3>
              <div className="lookup-display">
                <div className="lookup-row">
                  <div className="lookup-item"><span>Contact Name</span><span>{contact.contactName}</span></div>
                  <div className="lookup-item"><span>Mobile</span><span>{contact.mobile}</span></div>
                  <div className="lookup-item"><span>Email</span><span>{contact.email}</span></div>
                </div>
              </div>
            </div>
          )}
          {lead && (
            <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--brand-cyan)' }}>Converted From Lead (Lookup)</h3>
              <div className="lookup-display">
                <div className="lookup-row">
                  <div className="lookup-item"><span>Lead Name</span><span>{lead.leadName}</span></div>
                  <div className="lookup-item"><span>Budget</span><span>{formatCurrency(lead.budget)}</span></div>
                </div>
              </div>
            </div>
          )}

        </div>
        
        <DealInventorySection dealId={project.id} />
    </div>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>{label}</div>
      {children || <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value || '—'}</div>}
    </div>
  );
}
