'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2, X, FileText, Pencil, Eye } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

export default function ProjectDocumentsTab({ projectId }: { projectId: string }) {
  const { getProjectDocuments, addProjectDocument, deleteProjectDocument } = useData();
  const documents = getProjectDocuments(projectId);
  const [showCreate, setShowCreate] = useState(false);
  const [editDoc, setEditDoc] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Project Documents ({documents.length})</h3>
        </div>
        <button className="btn-primary text-sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-surface rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Date</th>
                <th>Attachment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No documents uploaded yet.</td></tr>
              ) : (
                documents.map(d => (
                  <tr key={d.id}>
                    <td className="font-medium" style={{ color: 'var(--ink)' }}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {d.documentName}
                      </div>
                    </td>
                    <td className="text-xs text-gray-500">{formatDate(d.documentDate)}</td>
                    <td className="text-sm text-blue-600">
                      {d.attachment && d.attachment.startsWith('/uploads/') ? (
                        <a href={d.attachment} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                          {d.attachment.split('-').slice(2).join('-') || 'Document'}
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500">
                          {d.attachment || '—'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2 pr-4">
                        {d.attachment && d.attachment.startsWith('/uploads/') ? (
                          <a href={d.attachment} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-blue-50 transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-500" />
                          </a>
                        ) : (
                          <button onClick={() => alert('Old file: File is not stored on the server.')} className="p-1.5 rounded-md hover:bg-gray-50 transition-colors" title="View (Unavailable)">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        <button onClick={() => setEditDoc(d)} className="p-1.5 rounded-md hover:bg-yellow-50 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4 text-yellow-600" />
                        </button>
                        <button onClick={() => { if (confirm('Delete?')) deleteProjectDocument(d.id); }} className="p-1.5 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
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

      {showCreate && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Upload Document</h2>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <DocumentForm
                projectId={projectId}
                onSubmit={p => { addProjectDocument(p); setShowCreate(false); }}
                onCancel={() => setShowCreate(false)}
              />
            </div>
          </div>
        </ModalPortal>
      )}

      {editDoc && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setEditDoc(null)}>
            <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Edit Document</h2>
                <button onClick={() => setEditDoc(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <DocumentForm
                projectId={projectId}
                initialData={editDoc}
                onSubmit={p => { useData().updateProjectDocument(editDoc.id, p); setEditDoc(null); }}
                onCancel={() => setEditDoc(null)}
              />
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

function DocumentForm({ projectId, initialData, onSubmit, onCancel }: {
  projectId: string;
  initialData?: any;
  onSubmit: (p: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    documentName: initialData?.documentName || '',
    documentDate: initialData?.documentDate || new Date().toISOString().split('T')[0],
    attachment: initialData?.attachment || '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let attachmentUrl = form.attachment;

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          attachmentUrl = data.url;
        } else {
          alert('Upload failed: ' + data.error);
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Upload failed due to network error');
        setIsUploading(false);
        return;
      }
    }

    onSubmit({ projectId, ...form, attachment: attachmentUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Document Name *</label>
          <input className="crm-input" value={form.documentName} onChange={e => set('documentName', e.target.value)} required placeholder="e.g. Floor Plan, Contract..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Date</label>
          <input type="date" className="crm-input" value={form.documentDate} onChange={e => set('documentDate', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Attachment {initialData ? '' : '*'}</label>
          {initialData && form.attachment && !selectedFile && (
            <div className="mb-2 text-sm text-gray-500">
              Current: <a href={form.attachment} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View File</a>
            </div>
          )}
          <input 
            type="file" 
            className="crm-input text-xs" 
            onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }} 
            required={!initialData} 
            disabled={isUploading}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} disabled={isUploading} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={isUploading} className="btn-primary disabled:opacity-50">
          {isUploading ? 'Uploading...' : (initialData ? 'Update Document' : 'Upload Document')}
        </button>
      </div>
    </form>
  );
}
