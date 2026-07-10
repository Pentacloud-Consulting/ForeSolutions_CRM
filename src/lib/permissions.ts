// ============================================================
// PENTAHOUSE CRM — Role-Based Permissions
// ============================================================

import { UserRole } from './types';

export type Module =
  | 'dashboard'
  | 'leads'
  | 'accounts'
  | 'contacts'
  | 'projects'
  | 'materials'
  | 'paymentDelivered'
  | 'oneTimePayments'
  | 'paymentReceived'
  | 'financialReports'
  | 'inventory';

const permissionMatrix: Record<UserRole, Module[]> = {
  admin: [
    'dashboard',
    'leads',
    'accounts',
    'contacts',
    'projects',
    'materials',
    'paymentDelivered',
    'oneTimePayments',
    'paymentReceived',
    'financialReports',
    'inventory',
  ],
  sales: ['dashboard', 'leads', 'accounts', 'contacts'],
  project_manager: ['dashboard', 'projects', 'materials', 'paymentDelivered'],
  accountant: [
    'dashboard',
    'paymentReceived',
    'oneTimePayments',
    'financialReports',
    'projects',
  ],
};

export function hasAccess(role: UserRole, module: Module): boolean {
  return permissionMatrix[role]?.includes(module) ?? false;
}

export function getAccessibleModules(role: UserRole): Module[] {
  return permissionMatrix[role] ?? [];
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  sales: 'Sales Team',
  project_manager: 'Project Manager',
  accountant: 'Accountant',
};
