'use client';

import React from 'react';
import { PurchaseOrderLineItem } from '@/lib/types';

interface Props {
  poNumber: string;
  vendorName: string;
  vendorAddress: string;
  deliverTo: string;
  poDate: string;
  terms: string;
  reference: string;
  deliveryCost: number;
  items: PurchaseOrderLineItem[];
  subTotal: number;
  totalVat: number;
  grandTotal: number;
}

export const TechPOPrintLayout = React.forwardRef<HTMLDivElement, Props>(
  ({ poNumber, vendorName, vendorAddress, deliverTo, poDate, terms, reference, deliveryCost, items, subTotal, totalVat, grandTotal }, ref) => {
    
    const formattedDate = new Date(poDate).toLocaleDateString('en-GB');

    return (
      <div ref={ref} className="tech-po-root">
        <style>{`
          .tech-po-root { font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; padding: 20px; max-width: 210mm; margin: 0 auto; font-size: 12px; line-height: 1.4; }
          .tech-po-root * { box-sizing: border-box; }
          .tpo-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .tpo-logo img { width: 200px; }
          .tpo-title-section { text-align: right; }
          .tpo-title { font-size: 24px; font-weight: 400; color: #111; margin-bottom: 2px; }
          .tpo-po-no { font-size: 13px; font-weight: bold; color: #374151; }
          
          .tpo-addresses { display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 11px; color: #4b5563; }
          .tpo-address-col { flex: 1; }
          .tpo-address-col strong { color: #111; font-size: 13px; display: block; margin-bottom: 2px; }
          .tpo-address-block { margin-bottom: 15px; }
          
          .tpo-meta-table { font-size: 11px; text-align: right; margin-left: auto; border-collapse: separate; border-spacing: 15px 4px; }
          .tpo-meta-table td:first-child { color: #6b7280; }
          .tpo-meta-table td:last-child { color: #111; }
          
          .tpo-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          .tpo-table tr { page-break-inside: avoid; break-inside: avoid; }
          .tpo-table th { background: #4b4b47; color: #fff; padding: 8px 10px; text-align: left; font-weight: normal; }
          .tpo-table td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          .tpo-table th.right, .tpo-table td.right { text-align: right; }
          .tpo-table th.center, .tpo-table td.center { text-align: center; }
          
          .tpo-totals-section { display: flex; justify-content: flex-end; margin-top: 15px; page-break-inside: avoid; break-inside: avoid; }
          .tpo-totals-table { font-size: 12px; border-collapse: collapse; width: 280px; }
          .tpo-totals-table td { padding: 6px 10px; }
          .tpo-totals-table td:first-child { text-align: right; color: #111; }
          .tpo-totals-table td:last-child { text-align: right; color: #111; }
          .tpo-totals-table tr.bold td { font-weight: bold; font-size: 13px; padding-top: 15px; }
        `}</style>

        <div className="tpo-header">
          <div className="tpo-logo">
            <img src="/logo-color.png" alt="Foresolutions" style={{ width: '200px' }} />
          </div>
          <div className="tpo-title-section">
            <div className="tpo-title">Purchase Order</div>
            <div className="tpo-po-no">Purchase Order# {poNumber}</div>
          </div>
        </div>

        <div className="tpo-addresses">
          <div className="tpo-address-col">
            <div className="tpo-address-block">
              <strong>Foresolutions Limited</strong>
              5C GP Centre, Yeoman Road<br />
              Ringwood BH24 3FF<br />
              United Kingdom<br />
              03300945344<br />
              support@foresolutions.co.uk<br />
              www.foresolutions.co.uk
            </div>
            
            <div className="tpo-address-block">
              Vendor Address<br />
              <strong>{vendorName}</strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>{vendorAddress}</div>
            </div>

            <div className="tpo-address-block">
              Deliver To<br />
              <div style={{ whiteSpace: 'pre-wrap', color: '#4b5563' }}>{deliverTo}</div>
            </div>
          </div>

          <div className="tpo-address-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <table className="tpo-meta-table">
              <tbody>
                <tr>
                  <td>Date :</td>
                  <td>{formattedDate}</td>
                </tr>
                <tr>
                  <td>Terms :</td>
                  <td>{terms}</td>
                </tr>
                <tr>
                  <td>Ref # :</td>
                  <td>{reference}</td>
                </tr>
                <tr>
                  <td>Delivery :</td>
                  <td>£{deliveryCost.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <table className="tpo-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item & Description</th>
              <th>Stock Type</th>
              <th className="center">Qty</th>
              <th className="right">Rate</th>
              <th className="right">VAT %</th>
              <th className="right">VAT</th>
              <th className="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <div style={{ color: '#111' }}>{item.itemDescription.split('\n')[0]}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>{item.itemDescription.split('\n').slice(1).join('\n')}</div>
                </td>
                <td>{item.stockType}</td>
                <td className="center">{item.qty.toFixed(2)}<br/><span style={{ fontSize: '10px', color: '#6b7280'}}>pcs</span></td>
                <td className="right">{item.rate.toFixed(2)}</td>
                <td className="right">{item.vatPercent.toFixed(2)}</td>
                <td className="right">{item.vatAmount.toFixed(2)}</td>
                <td className="right">{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tpo-totals-section">
          <table className="tpo-totals-table">
            <tbody>
              <tr>
                <td>Sub Total</td>
                <td>{subTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td>VAT on Income (20%)</td>
                <td>{totalVat.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bold">
                <td>Total</td>
                <td>£{grandTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    );
  }
);

TechPOPrintLayout.displayName = 'TechPOPrintLayout';
