import { useState, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Trash2, X, Package, FileText, Printer } from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';
import { TechQuotationPrintLayout } from './TechQuotationPrintLayout';
import { TechPOPrintLayout } from './TechPOPrintLayout';

export default function DealInventorySection({ dealId }: { dealId: string }) {
  const { data, addDealInventoryItem, deleteDealInventoryItem } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showPO, setShowPO] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const dealItems = data.dealInventoryItems.filter(item => item.projectId === dealId);
  const deal = data.projects.find(p => p.id === dealId);
  const account = data.accounts.find(a => a.id === deal?.accountId);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print.');
      return;
    }
    
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('\n');
      
    const html = `
      <html>
        <head>
          <title>Print Document</title>
          ${styles}
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white; 
            }
            @page { margin: 15mm; }
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            // Wait a moment for styles/fonts to load before printing
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const quoteItems = dealItems.map(item => {
    const product = data.inventoryProducts.find(p => p.id === item.productId);
    const billingType = product?.billingType === 'Monthly Recurring' ? 'Monthly' : 'One-Off';
    return {
      id: item.id,
      item: product?.productName || 'Unknown Product',
      description: product?.description || '',
      qty: item.quantity,
      billingType: billingType as 'Monthly' | 'One-Off' | 'Annual',
      unitPrice: product?.unitPrice || 0,
      totalValue: item.totalAmount
    };
  });

  const liveQuote = {
    quotationNumber: `QT-${deal?.projectId.split('-')[1] || '0001'}`,
    projectName: deal?.projectName || '',
    clientName: account?.clientName || 'Foresolutions Client',
    reference: deal?.dealType || '',
    quotationDate: new Date().toISOString(),
    items: quoteItems
  };

  const poItems = dealItems.map(item => {
    const product = data.inventoryProducts.find(p => p.id === item.productId);
    const amount = item.totalAmount;
    const vatPercent = 20;
    const vatAmount = amount * 0.2;
    return {
      id: item.id,
      itemDescription: product?.productName || 'Unknown Product',
      stockType: 'Sale' as const,
      qty: item.quantity,
      rate: product?.unitPrice || 0,
      vatPercent,
      vatAmount,
      amount
    };
  });

  const poSubTotal = dealItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const poTotalVat = poSubTotal * 0.2;
  const poGrandTotal = poSubTotal + poTotalVat + 10; // including delivery cost

  const livePO = {
    poNumber: `PO-Z${deal?.projectId.split('-')[1] || '001'}`,
    vendorName: 'CAMERA TELEMATICS UK LTD',
    vendorAddress: 'UNIT 4 , KINGFISHER COURT\nNEWBURY\nRG14 5SL BERKS',
    deliverTo: 'Head Office\n5C GP Centre, Yeoman Road\nRingwood BH24 3FF\nUnited Kingdom\n03300945344\nsupport@foresolutions.co.uk',
    poDate: new Date().toISOString(),
    terms: 'Due on Receipt',
    reference: `#${deal?.projectId.split('-')[1] || '4950'}`,
    deliveryCost: 10.00,
    items: poItems,
    subTotal: poSubTotal,
    totalVat: poTotalVat,
    grandTotal: poGrandTotal
  };

  return (
    <div className="bg-surface rounded-xl p-6 mt-6" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--brand-cyan)' }}>
          <Package className="w-4 h-4" /> Deal Inventory
        </h3>
        <div className="flex gap-3">
          <button onClick={() => setShowQuote(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-medium" style={{ color: 'var(--ink)' }}>
            <FileText className="w-3.5 h-3.5 text-blue-500" /> Create Quotation
          </button>
          <button onClick={() => setShowPO(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-medium" style={{ color: 'var(--ink)' }}>
            <FileText className="w-3.5 h-3.5 text-green-500" /> Generate PO
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealItems.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No inventory items added to this deal.</td></tr>
            ) : (
              dealItems.map(item => {
                const product = data.inventoryProducts.find(p => p.id === item.productId);
                return (
                  <tr key={item.id}>
                    <td className="font-semibold" style={{ color: 'var(--ink)' }}>{product?.productName || 'Unknown Product'}</td>
                    <td>{product?.category || '—'}</td>
                    <td>{formatCurrency(product?.unitPrice || 0)}</td>
                    <td>{item.quantity}</td>
                    <td className="font-semibold" style={{ color: 'var(--brand-cyan)' }}>{formatCurrency(item.totalAmount)}</td>
                    <td className="text-xs text-gray-500">{formatDate(item.addedAt)}</td>
                    <td>
                      <button onClick={() => { if (confirm('Remove item from deal?')) deleteDealInventoryItem(item.id); }} className="p-1.5 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddInventoryItemModal
          dealId={dealId}
          onClose={() => setShowModal(false)}
          onAdd={(productId, quantity) => {
            addDealInventoryItem({ projectId: dealId, productId, quantity, notes: '' });
            setShowModal(false);
          }}
        />
      )}

      {showQuote && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowQuote(false)}>
            <div className="modal-content" style={{ maxWidth: '1000px', height: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <h2 className="text-lg font-bold">Quotation Preview</h2>
                <div className="flex gap-3">
                  <button onClick={handlePrint} className="btn-primary py-1.5 px-3"><Printer className="w-4 h-4" /> Download / Print</button>
                  <button onClick={() => setShowQuote(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center border rounded-lg">
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                  <TechQuotationPrintLayout ref={printRef} {...liveQuote} />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showPO && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowPO(false)}>
            <div className="modal-content" style={{ maxWidth: '1000px', height: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <h2 className="text-lg font-bold">Purchase Order Preview</h2>
                <div className="flex gap-3">
                  <button onClick={handlePrint} className="btn-primary py-1.5 px-3"><Printer className="w-4 h-4" /> Download / Print</button>
                  <button onClick={() => setShowPO(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center border rounded-lg">
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                  <TechPOPrintLayout ref={printRef} {...livePO} />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

function AddInventoryItemModal({ dealId, onClose, onAdd }: { dealId: string; onClose: () => void; onAdd: (productId: string, quantity: number) => void; }) {
  const { data } = useData();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');

  // Filter products that have stock > 0
  const availableProducts = data.inventoryProducts;

  const selectedProduct = availableProducts.find(p => p.id === productId);

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display" style={{ color: 'var(--ink)' }}>Add Inventory to Deal</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (productId && quantity) {
                onAdd(productId, Number(quantity));
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Select Product *</label>
              <select className="crm-select" value={productId} onChange={e => setProductId(e.target.value)} required>
                <option value="">— Select a Product —</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.productName} ({formatCurrency(p.unitPrice)}/{p.billingType}) - {p.stockQuantity} in stock
                  </option>
                ))}
              </select>
            </div>
            
            {selectedProduct && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Available Stock:</span>
                  <span className="font-medium text-gray-800">{selectedProduct.stockQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unit Price:</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedProduct.unitPrice)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>Quantity *</label>
              <input 
                type="number" 
                min="1" 
                max={selectedProduct ? selectedProduct.stockQuantity : undefined}
                className="crm-input" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)} 
                required 
              />
            </div>

            {selectedProduct && quantity && Number(quantity) > 0 && (
              <div className="flex justify-between items-center py-3 border-t border-gray-100 mt-2">
                <span className="font-semibold text-gray-700">Total Amount:</span>
                <span className="text-lg font-bold" style={{ color: 'var(--brand-cyan)' }}>
                  {formatCurrency(selectedProduct.unitPrice * Number(quantity))}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="btn-primary" disabled={!productId || Number(quantity) <= 0}>Add to Deal</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
