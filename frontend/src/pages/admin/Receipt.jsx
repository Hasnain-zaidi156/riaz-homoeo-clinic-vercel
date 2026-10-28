import { useMemo, useRef } from 'react'
import { Modal } from './ui'

/* Order ki A4 raseed. Preview aur print dono ek hi HTML se bante hain (iframe).
   Delivery hamesha 500 PKR. */
export const RECEIPT_DELIVERY = 500
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const pkr = n => 'PKR ' + Number(n || 0).toLocaleString('en-US')
const fmtDate = d => { try { return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) } catch { return '' } }

export function receiptHtml(o) {
  const items = (o.items || []).map(i => ({ ...i, qty: Number(i.qty) || 1, price: Number(i.price) || 0 }))
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + RECEIPT_DELIVERY
  const no = 'RHC-' + String(o._id || '').slice(-6).toUpperCase()
  const rows = items.map((i, k) => `<tr><td class="c">${k + 1}</td><td>${esc(i.name)}</td><td class="c">${i.qty}</td><td class="r">${pkr(i.price)}</td><td class="r">${pkr(i.price * i.qty)}</td></tr>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${no}</title>
<style>
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#e9edf2}
body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#16222e;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;padding:16mm 16mm 14mm;position:relative}
.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0f5f4a;padding-bottom:5mm}
.brand h1{margin:0;font-size:24px;color:#0f5f4a;letter-spacing:.3px}
.brand p{margin:2px 0 0;font-size:11.5px;color:#4a5a68;line-height:1.5}
.rcpt{text-align:right}
.rcpt h2{margin:0;font-size:20px;letter-spacing:3px;color:#16222e}
.rcpt p{margin:3px 0 0;font-size:12px;color:#4a5a68}
.rcpt b{color:#16222e}
.meta{display:flex;gap:8mm;margin:7mm 0 6mm}
.box{flex:1;border:1px solid #d6dde4;border-radius:6px;padding:4mm 5mm}
.box h3{margin:0 0 2mm;font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:#0f5f4a}
.box p{margin:1.5px 0;font-size:13px;line-height:1.45;word-break:break-word}
.box .nm{font-size:15px;font-weight:700}
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{background:#0f5f4a;color:#fff;padding:7px 9px;font-size:11.5px;text-align:left;letter-spacing:.5px}
td{padding:8px 9px;border-bottom:1px solid #e3e8ed;vertical-align:top}
tbody tr:nth-child(even) td{background:#f7f9fb}
.c{text-align:center;width:48px}.r{text-align:right;white-space:nowrap}
thead th.c{text-align:center}thead th.r{text-align:right}
.totals{width:88mm;margin:6mm 0 0 auto;font-size:13.5px}
.totals div{display:flex;justify-content:space-between;padding:5px 9px;border-bottom:1px solid #e3e8ed}
.totals .grand{background:#0f5f4a;color:#fff;font-size:16px;font-weight:700;border:0;border-radius:5px;margin-top:3px;padding:9px}
.pay{margin-top:9mm;border:1px dashed #b9c4ce;border-radius:6px;padding:4mm 5mm;font-size:12px;line-height:1.6;color:#33424f}
.foot{position:absolute;left:16mm;right:16mm;bottom:12mm;text-align:center;font-size:11px;color:#6a7a88;border-top:1px solid #d6dde4;padding-top:4mm}
.foot b{color:#0f5f4a;font-size:12.5px}
@media print{html,body{background:#fff}.page{margin:0;box-shadow:none}}
</style></head><body><div class="page">
<div class="head">
  <div class="brand"><h1>Riaz Homoeo Clinic</h1><p>Dr. Syed Fawad Ahmed Zaidi<br>Dhak Bazar, Rohri, Sindh<br>0333-7189748 &nbsp;|&nbsp; 0312-3875580</p></div>
  <div class="rcpt"><h2>RECEIPT</h2><p>Receipt No: <b>${no}</b></p><p>Date: <b>${esc(fmtDate(o.createdAt || Date.now()))}</b></p></div>
</div>
<div class="meta">
  <div class="box"><h3>Customer</h3><p class="nm">${esc(o.name)}</p><p>Phone: ${esc(o.phone)}</p><p>Address: ${esc(o.address || '—')}</p></div>
  <div class="box"><h3>Order</h3><p>Order ID: ${no}</p><p>Status: <b style="text-transform:capitalize">${esc(o.status || 'new')}</b></p><p>Items: ${items.reduce((s, i) => s + i.qty, 0)}</p></div>
</div>
<table><thead><tr><th class="c">#</th><th>Product</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div class="totals">
  <div><span>Sub Total</span><span>${pkr(subtotal)}</span></div>
  <div><span>Delivery Charges</span><span>${pkr(RECEIPT_DELIVERY)}</span></div>
  <div class="grand"><span>Total</span><span>${pkr(total)}</span></div>
</div>
<div class="pay"><b>Payment:</b> Online Payment — Easypaisa (0333-7189748)<br>Please send the payment screenshot on WhatsApp 0312-3875580 to confirm your order.</div>
<div class="foot"><b>Thank you for your order!</b><br>Riaz Homoeo Clinic · Est. Since 1967 · Rohri, Sindh</div>
</div></body></html>`
}

export default function Receipt({ order, onClose }) {
  const ref = useRef(null)
  const html = useMemo(() => receiptHtml(order), [order])
  const print = () => { const w = ref.current?.contentWindow; if (w) { w.focus(); w.print() } }
  return (
    <Modal title="Receipt" size="lg" onClose={onClose}
      footer={<><button type="button" className="adm-btn" onClick={onClose}>Close</button>
        <button type="button" className="adm-btn primary" onClick={print}>Print receipt</button></>}>
      <div className="adm-receipt-frame">
        <iframe ref={ref} title="Receipt preview" srcDoc={html} />
      </div>
      <p className="adm-muted" style={{ marginTop: '.6rem', fontSize: '.8rem' }}>Print dialog mein “Save as PDF” chun kar PDF bhi ban sakti hai.</p>
    </Modal>
  )
}
