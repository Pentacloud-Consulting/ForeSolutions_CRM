'use client';

import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { hasAccess } from '@/lib/permissions';
import { formatCurrency } from '@/lib/utils';
import {
  Users, Building2, FolderKanban, TrendingUp, TrendingDown,
  DollarSign, Percent, AlertCircle, CheckCircle2, PauseCircle, Hammer
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['var(--brand-cyan)', 'var(--brand-green)', 'var(--brand-orange)', 'var(--brand-pink)', 'var(--ink)'];

export default function DashboardPage() {
  const { data, getProjectFinancialSummary } = useData();
  const { user } = useAuth();

  if (!user) return null;

  // ── Lead stats ──
  const totalLeads = data.leads.length;
  const qualifiedLeads = data.leads.filter(l => l.status === 'Qualified' || l.status === 'Converted').length;
  const lostLeads = data.leads.filter(l => l.status === 'Lost').length;
  const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

  // ── Project stats ──
  const activeProjects = data.projects.filter(p => p.isActive !== false).length;
  const completedProjects = data.projects.filter(p => p.status === 'Completed').length;
  const onHoldProjects = data.projects.filter(p => p.status === 'On Hold').length;

  // ── Financial aggregates ──
  let totalMaterialCost = 0;
  let totalLabourCost = 0;
  let totalOneTimeCost = 0;
  let totalReceived = 0;
  let totalOutstanding = 0;
  const categoryTotals: Record<string, number> = {};

  data.projects.forEach(project => {
    const summary = getProjectFinancialSummary(project.id);
    totalMaterialCost += summary.totalMaterialsCost;
    totalLabourCost += summary.totalLabourCost;
    totalOneTimeCost += summary.totalOneTimeExpenses;
    totalReceived += summary.totalAmountReceived;
    totalOutstanding += summary.outstandingAmount;

    Object.entries(summary.materialsByCategory).forEach(([cat, val]) => {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
    });
  });

  const totalProfitLoss = totalReceived - (totalMaterialCost + totalLabourCost + totalOneTimeCost);

  const categoryChartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // ── Lead status distribution for pie chart ──
  const leadStatusCounts: Record<string, number> = {};
  data.leads.forEach(l => {
    leadStatusCounts[l.status] = (leadStatusCounts[l.status] || 0) + 1;
  });
  const leadPieData = Object.entries(leadStatusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display" style={{ color: 'var(--ink)' }}>
            Dashboard
          </h2>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* ── Lead Dashboard ── */}
      {hasAccess(user.role, 'leads') && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
            Lead Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Leads" value={totalLeads} color="var(--brand-cyan)" />
            <StatCard icon={CheckCircle2} label="Qualified" value={qualifiedLeads} color="var(--brand-green)" />
            <StatCard icon={AlertCircle} label="Lost" value={lostLeads} color="var(--brand-pink)" />
            <StatCard icon={Percent} label="Conversion Rate" value={`${conversionRate}%`} color="var(--brand-cyan)" />
          </div>
          {leadPieData.length > 0 && (
            <div className="mt-6 bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--ink)' }}>Lead Status Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie data={leadPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}>
                      {leadPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Project Dashboard ── */}
      {hasAccess(user.role, 'projects') && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <FolderKanban className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
            Project Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/crm/projects?filter=Active">
              <StatCard icon={FolderKanban} label="Active Deals" value={activeProjects} color="var(--brand-cyan)" />
            </Link>
            <Link href="/crm/projects?filter=Inactive">
              <StatCard icon={PauseCircle} label="Inactive Deals" value={data.projects.length - activeProjects} color="var(--brand-orange)" />
            </Link>
            <StatCard icon={CheckCircle2} label="Completed" value={completedProjects} color="var(--brand-green)" />
          </div>
        </section>
      )}

      {/* ── Material Dashboard ── */}
      {hasAccess(user.role, 'materials') && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <Hammer className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
            Material Overview
          </h3>
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <StatCard icon={DollarSign} label="Total Material Cost" value={formatCurrency(totalMaterialCost)} color="var(--ink)" />
          </div>
          {categoryChartData.length > 0 && (
            <div className="bg-surface rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--ink)' }}>Category-wise Material Cost</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={categoryChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                    <Bar dataKey="value" fill="var(--brand-cyan)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Finance Dashboard ── */}
      {hasAccess(user.role, 'financialReports') && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <DollarSign className="w-5 h-5" style={{ color: 'var(--brand-cyan)' }} />
            Financial Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard icon={TrendingUp} label="Total Received" value={formatCurrency(totalReceived)} color="var(--brand-green)" />
            <StatCard icon={DollarSign} label="Labour Cost" value={formatCurrency(totalLabourCost)} color="var(--brand-cyan)" />
            <StatCard icon={DollarSign} label="One-Time Expenses" value={formatCurrency(totalOneTimeCost)} color="var(--brand-orange)" />
            <StatCard icon={AlertCircle} label="Outstanding" value={formatCurrency(totalOutstanding)} color="var(--brand-pink)" />
            <StatCard
              icon={totalProfitLoss >= 0 ? TrendingUp : TrendingDown}
              label="Profit / Loss"
              value={formatCurrency(totalProfitLoss)}
              color={totalProfitLoss >= 0 ? 'var(--brand-green)' : 'var(--brand-pink)'}
            />
          </div>
        </section>
      )}

      {/* Empty state */}
      {data.leads.length === 0 && data.projects.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto mb-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="var(--brand-cyan)" strokeWidth="2" strokeDasharray="4 4"/>
            <circle cx="50" cy="50" r="30" stroke="var(--brand-green)" strokeWidth="2" opacity="0.8"/>
            <circle cx="50" cy="50" r="20" stroke="var(--brand-pink)" strokeWidth="2" opacity="0.6"/>
            <circle cx="50" cy="50" r="10" stroke="var(--brand-orange)" strokeWidth="2" opacity="0.4"/>
          </svg>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>Welcome to Fore Solutions</h3>
          <p className="text-gray-500">Start by adding your first record to see the pipeline converge.</p>
        </div>
      )}
    </div>
  );
}

// ── Stat Card Component ──
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="bg-surface rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent" style={{ border: `2px solid ${color}` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
        {value}
      </div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
    </div>
  );
}
