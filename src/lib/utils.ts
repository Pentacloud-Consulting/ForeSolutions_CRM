// ============================================================
// PENTAHOUSE CRM — Utility Functions
// ============================================================

/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '£0.00';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
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
    return d.toLocaleDateString('en-GB', {
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
    New: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    Contacted: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    'Follow Up': 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    'Site Visit Scheduled': 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    'Proposal Sent': 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    Qualified: 'bg-brand-green/10 text-brand-green border border-brand-green/20',
    Lost: 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20',
    Converted: 'bg-brand-green/10 text-brand-green border border-brand-green/20',
    // Project statuses
    Planning: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    Foundation: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    Construction: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    Interior: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    Completed: 'bg-brand-green/10 text-brand-green border border-brand-green/20',
    'On Hold': 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
}
