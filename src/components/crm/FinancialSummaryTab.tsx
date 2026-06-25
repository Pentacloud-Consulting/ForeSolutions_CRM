'use client';

import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/lib/utils';
import { materialCategoryOptions } from '@/data/materialOptions';
import {
  TrendingUp, TrendingDown, DollarSign, Hammer, FileText, CreditCard, AlertCircle, Package
} from 'lucide-react';

export default function FinancialSummaryTab({ projectId }: { projectId: string }) {
  const { getProjectFinancialSummary } = useData();
  const summary = getProjectFinancialSummary(projectId);

  const rows = [
    { label: 'Project Contract Value', value: summary.projectContractValue, icon: FileText, color: '#0F1C2E' },
    { label: 'Total Materials Cost', value: summary.totalMaterialsCost, icon: Hammer, color: '#2563EB' },
    { label: 'Total Labour Cost', value: summary.totalLabourCost, icon: CreditCard, color: '#7C3AED' },
    { label: 'Total One-Time Expenses', value: summary.totalOneTimeExpenses, icon: DollarSign, color: '#EA580C' },
    { label: 'Total Other Materials Cost', value: summary.totalOtherMaterialsCost, icon: Package, color: '#0891B2' },
    { label: 'Total Project Cost', value: summary.totalProjectCost, icon: DollarSign, color: '#DC2626', bold: true },
    { label: 'Total Amount Received', value: summary.totalAmountReceived, icon: TrendingUp, color: '#059669' },
    { label: 'Outstanding Amount', value: summary.outstandingAmount, icon: AlertCircle, color: '#DC2626' },
    {
      label: 'Profit / Loss',
      value: summary.profitLoss,
      icon: summary.profitLoss >= 0 ? TrendingUp : TrendingDown,
      color: summary.profitLoss >= 0 ? '#059669' : '#DC2626',
      bold: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold" style={{ color: '#0F1C2E' }}>Financial Summary</h3>

      {/* Main financial metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
        <div className="space-y-0">
          {rows.map((row, i) => {
            const Icon = row.icon;
            const isBold = 'bold' in row && row.bold;
            return (
              <div
                key={row.label}
                className={`flex items-center justify-between py-4 ${i < rows.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: isBold ? '#C9A84C' : '#F1F5F9' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${row.color}12` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: row.color }} />
                  </div>
                  <span
                    className={`text-sm ${isBold ? 'font-bold text-base' : 'font-medium'}`}
                    style={{ color: '#0F1C2E' }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className={`${isBold ? 'text-lg font-bold' : 'text-base font-semibold'}`}
                  style={{ color: row.color }}
                >
                  {formatCurrency(row.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category-wise material breakdown */}
      {Object.keys(summary.materialsByCategory).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: '#C9A84C' }}>
            Material Cost Breakdown
          </h4>
          <div className="space-y-3">
            {materialCategoryOptions.map(cat => {
              const val = summary.materialsByCategory[cat];
              if (!val) return null;
              const pct = summary.totalMaterialsCost > 0 ? (val / summary.totalMaterialsCost) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{cat}</span>
                    <span className="text-sm font-semibold" style={{ color: '#0F1C2E' }}>{formatCurrency(val)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C9A84C, #D4B966)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 flex justify-between" style={{ borderTop: '2px solid #C9A84C' }}>
            <span className="text-sm font-bold" style={{ color: '#0F1C2E' }}>Total Materials</span>
            <span className="text-sm font-bold" style={{ color: '#C9A84C' }}>{formatCurrency(summary.totalMaterialsCost)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
