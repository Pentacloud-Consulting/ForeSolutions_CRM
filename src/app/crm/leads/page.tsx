'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { Lead, LeadSource, LeadStatus } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor, truncate } from '@/lib/utils';
import { Plus, Search, Filter, Eye, Trash2, X } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

const leadSources: LeadSource[] = ['Referral', 'Walk-in', 'Social Media', 'Website', 'Other'];
const leadStatuses: LeadStatus[] = ['New', 'Contacted', 'Follow Up', 'Site Visit Scheduled', 'Proposal Sent', 'Qualified', 'Lost'];

export default function LeadsPage() {
  const { data, addLead, deleteLead } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = data.leads.filter(l => {
    const matchSearch =
      l.leadName.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile.includes(search) ||
      (l.companyName && l.companyName.toLowerCase().includes(search.toLowerCase())) ||
      (l.industry && l.industry.toLowerCase().includes(search.toLowerCase())) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold font-display" style={{ color: 'var(--ink)' }}>
            Leads
          </h2>
          <p className="text-gray-500 mt-1">{data.leads.length} total leads</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="crm-input pl-10"
            placeholder="Search by name, company, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="crm-select pl-10 w-full sm:w-48"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {[...leadStatuses, 'Converted'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No leads found. Create your first lead to get started.
                  </td>
                </tr>
              ) : (
                filtered.map(lead => (
                  <tr key={lead.id}>
                    <td className="font-medium" style={{ color: 'var(--ink)' }}>{lead.leadName}</td>
                    <td>{lead.companyName || '—'}</td>
                    <td>{lead.industry || '—'}</td>
                    <td>{lead.mobile}</td>
                    <td className="text-gray-500">{truncate(lead.email, 25)}</td>
                    <td>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="text-gray-500 text-xs">{formatDate(lead.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/leads/${lead.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        <button
                          onClick={() => { if (confirm('Delete this lead?')) deleteLead(lead.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreate={(lead) => { addLead(lead); setShowCreate(false); }}
        />
      )}
    </>
  );
}

// ── Create Lead Modal ──
function CreateLeadModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [form, setForm] = useState({
    leadName: '',
    companyName: '',
    industry: '',
    interestedIn: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    address: '',
    city: '',
    budget: '',
    leadSource: 'Website' as LeadSource,
    status: 'New' as LeadStatus,
    notes: '',
  });

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...form,
      budget: form.budget ? Number(form.budget) : null,
    });
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display" style={{ color: 'var(--ink)' }}>
              Create New Lead
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Lead Name *</label>
                <input className="crm-input" value={form.leadName} onChange={e => set('leadName', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Mobile Number *</label>
                <input className="crm-input" value={form.mobile} onChange={e => set('mobile', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Alternate Mobile</label>
                <input className="crm-input" value={form.alternateMobile} onChange={e => set('alternateMobile', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Email</label>
                <input type="email" className="crm-input" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Company Name</label>
                <input className="crm-input" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Industry</label>
                <input className="crm-input" placeholder="e.g. Logistics, Retail" value={form.industry} onChange={e => set('industry', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Interested In</label>
                <input className="crm-input" placeholder="e.g. AI Cameras, Tracepoint" value={form.interestedIn} onChange={e => set('interestedIn', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>City</label>
                <input className="crm-input" value={form.city} onChange={e => set('city', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Budget (₹)</label>
                <input type="number" className="crm-input" value={form.budget} onChange={e => set('budget', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Lead Source</label>
                <select className="crm-select" value={form.leadSource} onChange={e => set('leadSource', e.target.value)}>
                  {leadSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Status</label>
                <select className="crm-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Address</label>
              <textarea className="crm-textarea" value={form.address} onChange={e => set('address', e.target.value)} rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Notes</label>
              <textarea className="crm-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
