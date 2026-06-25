// ============================================================
// PENTAHOUSE CRM — Utility Functions
// ============================================================

/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Generate a project ID like PROJ-0001
 */
export function generateProjectId(counter: number): string {
  return `PROJ-${String(counter).padStart(4, '0')}`;
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generate a short unique ID
 */
export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
}

/**
 * Get current ISO date string
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Truncate text for table display
 */
export function truncate(str: string, max = 40): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Status color mapping
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Lead statuses
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-indigo-100 text-indigo-800',
    'Follow Up': 'bg-yellow-100 text-yellow-800',
    'Site Visit Scheduled': 'bg-purple-100 text-purple-800',
    'Proposal Sent': 'bg-orange-100 text-orange-800',
    Qualified: 'bg-green-100 text-green-800',
    Lost: 'bg-red-100 text-red-800',
    Converted: 'bg-emerald-100 text-emerald-800',
    // Project statuses
    Planning: 'bg-blue-100 text-blue-800',
    Foundation: 'bg-amber-100 text-amber-800',
    Construction: 'bg-orange-100 text-orange-800',
    Interior: 'bg-violet-100 text-violet-800',
    Completed: 'bg-green-100 text-green-800',
    'On Hold': 'bg-gray-100 text-gray-800',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}
