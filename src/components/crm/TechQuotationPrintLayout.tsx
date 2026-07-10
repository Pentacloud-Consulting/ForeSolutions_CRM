'use client';

import React from 'react';
import { QuotationLineItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  items: QuotationLineItem[];
  projectName: string;
  clientName: string;
  reference: string;
  quotationNumber: string;
  quotationDate: string;
}

export const TechQuotationPrintLayout = React.forwardRef<HTMLDivElement, Props>(
  ({ items, projectName, clientName, reference, quotationNumber, quotationDate }, ref) => {
    
    const monthlyItems = items.filter(i => i.billingType === 'Monthly' || i.billingType === 'Annual');
    const oneOffItems = items.filter(i => i.billingType === 'One-Off');

    const totalMonthlyRecurring = monthlyItems.reduce((acc, item) => acc + (item.billingType === 'Monthly' ? item.unitPrice * item.qty : 0), 0);
    const totalOneOff = oneOffItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
    const firstYearTotal = (totalMonthlyRecurring * 12) + totalOneOff;
    const vatOnMonthly = totalMonthlyRecurring * 0.20;
    const monthlyTotalIncVat = totalMonthlyRecurring + vatOnMonthly;
    const vatOnOneOff = totalOneOff * 0.20;
    const oneOffTotalIncVat = totalOneOff + vatOnOneOff;
    const totalVat = vatOnMonthly * 12 + vatOnOneOff;
    const grandTotalIncVat = firstYearTotal + totalVat;

    const formattedDate = new Date(quotationDate).toLocaleDateString('en-GB');

    return (
      <div ref={ref} className="tech-quote-root">
        <style>{`
          .tech-quote-root { font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; padding: 20px; max-width: 210mm; margin: 0 auto; font-size: 12px; line-height: 1.4; }
          .tech-quote-root * { box-sizing: border-box; }
          .tq-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
          .tq-logo img { width: 200px; }
          .tq-title-section { text-align: right; }
          .tq-title { font-size: 24px; font-weight: 300; letter-spacing: 2px; color: #111; margin-bottom: 2px; }
          .tq-quote-no { font-size: 14px; color: #4b5563; }
          .tq-addresses { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; color: #4b5563; }
          .tq-address-block strong { color: #111; font-size: 13px; display: block; margin-bottom: 2px; }
          .tq-meta-table { font-size: 11px; margin-top: 10px; text-align: right; margin-left: auto; border-collapse: separate; border-spacing: 10px 2px; }
          .tq-meta-table td:first-child { color: #6b7280; }
          .tq-meta-table td:last-child { color: #111; }
          .tq-summary-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 15px; margin-bottom: 15px; }
          .tq-summary-title { font-size: 16px; font-weight: 600; color: #166534; margin-bottom: 8px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px; }
          .tq-summary-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px; }
          .tq-summary-row.bold { font-weight: bold; font-size: 14px; color: #166534; margin-top: 8px; border-top: 1px solid #bbf7d0; padding-top: 8px; }
          .tq-section-title { font-size: 16px; font-weight: 600; color: #115e59; margin-bottom: 6px; margin-top: 15px; page-break-after: avoid; break-after: avoid; }
          .tq-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          .tq-table tr { page-break-inside: avoid; break-inside: avoid; }
          .tq-table th { background: #4b5563; color: #fff; padding: 6px 8px; text-align: left; font-weight: 500; }
          .tq-table td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
          .tq-table th.right, .tq-table td.right { text-align: right; }
          .tq-table th.center, .tq-table td.center { text-align: center; }
          .tq-table-footer td { background: #f0fdf4; color: #166534; font-weight: bold; padding: 8px 8px; border: none; }
          .tq-totals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; page-break-inside: avoid; break-inside: avoid; }
          .tq-totals-box { font-size: 12px; }
          .tq-totals-row { display: flex; justify-content: space-between; padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
          .tq-totals-row.header { background: #4b5563; color: #fff; font-weight: bold; border: none; }
          .tq-totals-row.grand { background: #166534; color: #fff; font-weight: bold; border: none; font-size: 13px; }
          .tq-footer-msg { margin-top: 20px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        `}</style>

        <div className="tq-header">
          <div className="tq-logo">
            <img src="/logo-color.png" alt="Foresolutions" style={{ width: '200px' }} />
          </div>
          <div className="tq-title-section">
            <div className="tq-title">QUOTE</div>
            <div className="tq-quote-no">{quotationNumber}</div>
          </div>
        </div>

        <div className="tq-addresses">
          <div className="tq-address-block">
            <strong>Foresolutions Limited</strong>
            5C GP Centre, Yeoman Road<br />
            Ringwood BH24 3FF<br />
            United Kingdom<br />
            03300945344<br />
            support@foresolutions.co.uk<br />
            www.foresolutions.co.uk
          </div>
          <div>
            <table className="tq-meta-table">
              <tbody>
                <tr>
                  <td>Bill To:</td>
                  <td>{clientName}</td>
                </tr>
                <tr>
                  <td>Reference #:</td>
                  <td>{reference || 'Services'}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{formattedDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="tq-summary-box">
          <div className="tq-summary-title">Quote Summary</div>
          <div className="tq-summary-row">
            <span>Total Monthly Recurring:</span>
            <span>£{totalMonthlyRecurring.toFixed(2)} + VAT</span>
          </div>
          <div className="tq-summary-row">
            <span>Total One-Off Purchase:</span>
            <span>£{totalOneOff.toFixed(2)} + VAT</span>
          </div>
          <div className="tq-summary-row">
            <span>First Year Total:</span>
            <span>£{firstYearTotal.toFixed(2)} + VAT</span>
          </div>
          <div className="tq-summary-row bold">
            <span>Grand Total Inc VAT:</span>
            <span>£{grandTotalIncVat.toFixed(2)}</span>
          </div>
        </div>

        <div className="tq-section-title">Monthly Recurring Services</div>
        <table className="tq-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th className="center">Qty</th>
              <th>Billing</th>
              <th className="right">Monthly Price</th>
              <th className="right">Annual Value</th>
            </tr>
          </thead>
          <tbody>
            {monthlyItems.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No recurring services on this quote.</td></tr>
            ) : (
              monthlyItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.description || item.item}</td>
                  <td className="center">{item.qty}</td>
                  <td>Monthly</td>
                  <td className="right">£{item.unitPrice.toFixed(2)}</td>
                  <td className="right">£{(item.unitPrice * item.qty * 12).toFixed(2)}</td>
                </tr>
              ))
            )}
            <tr className="tq-table-footer">
              <td colSpan={5} className="right">Monthly Recurring Total:</td>
              <td className="right">£{totalMonthlyRecurring.toFixed(2)} ex VAT</td>
            </tr>
          </tbody>
        </table>

        <div className="tq-section-title">One-Off Purchases</div>
        <table className="tq-table" style={{ marginBottom: 0 }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th className="center">Qty</th>
              <th className="right">Unit Price</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {oneOffItems.length === 0 ? (
              <tr><td colSpan={5} style={{ background: '#f3f4f6', textAlign: 'center', padding: '15px', color: '#6b7280' }}>No one-off charges on this quote.</td></tr>
            ) : (
              oneOffItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.description || item.item}</td>
                  <td className="center">{item.qty}</td>
                  <td className="right">£{item.unitPrice.toFixed(2)}</td>
                  <td className="right">£{(item.unitPrice * item.qty).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="tq-section-title" style={{ pageBreakBefore: 'auto' }}>Totals</div>
        <div className="tq-totals-grid">
          <div className="tq-totals-box">
            <div className="tq-totals-row header">
              <span>Monthly Recurring Total:</span>
              <span>£{totalMonthlyRecurring.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>VAT on Monthly Total:</span>
              <span>£{vatOnMonthly.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>Monthly Total Inc VAT:</span>
              <span>£{monthlyTotalIncVat.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row" style={{ marginTop: '20px', background: '#f0fdf4', color: '#166534', fontWeight: 'bold', border: 'none' }}>
              <span>One-Off Purchase Total:</span>
              <span>£{totalOneOff.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>Monthly Total Inc VAT:</span>
              <span>£{monthlyTotalIncVat.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>One-Off Purchase Total:</span>
              <span>£{totalOneOff.toFixed(2)}</span>
            </div>
          </div>
          <div className="tq-totals-box">
            <div className="tq-totals-row header">
              <span>First Year Contract Value:</span>
              <span>£{firstYearTotal.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>Total VAT:</span>
              <span>£{totalVat.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>Grand Total:</span>
              <span>£{totalOneOff.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row" style={{ marginTop: '20px', background: '#e5e7eb', fontWeight: 'bold', border: 'none' }}>
              <span>First Year Contract Value:</span>
              <span>£{firstYearTotal.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row">
              <span>Total VAT:</span>
              <span>£{totalVat.toFixed(2)}</span>
            </div>
            <div className="tq-totals-row grand">
              <span>Grand Total Inc VAT:</span>
              <span>£{grandTotalIncVat.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="tq-footer-msg">
          Thanks in advance for your business.
        </div>
      </div>
    );
  }
);

TechQuotationPrintLayout.displayName = 'TechQuotationPrintLayout';
