import { useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'

const SIZES = {
  Dress: ['38', '40', '42', '44', '46'],
  Abaya: ['50', '52', '54', '56'],
  Khimar: ['1 Layer', '2 Layer', '3 Layer'],
}

const today = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const num = (v) => parseFloat(v) || 0

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.14em] text-[#1E0007]/55">{label}</span>
      {children}
    </label>
  )
}

const Section = ({ children }) => (
  <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#470000]">{children}</h2>
)
const Rule = () => <hr className="my-5 border-0 border-t border-[#1E0007]/15" />

const Icon = ({ d, fill }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 text-[#470000]"
    fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const FB = 'M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8z'
const WA = 'M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.8 13.3l-.3-.2-2.7.7.7-2.6-.2-.3A7.2 7.2 0 0 1 12 4.8zm-2.6 3.4c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.3s1 2.7 1.1 2.8c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4z'
const IG = 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01'

export default function App() {
  const sheetRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [f, setF] = useState({
    invoiceNo: '', date: today(), name: '', address: '', mobile: '',
    item: 'Dress', size: SIZES.Dress[0],
    price: '', delivery: '', advanced: '',
    facebook: 'facebook.com/ezaara', whatsapp: '', instagram: '@ezaara',
  })

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const setItem = (e) => {
    const item = e.target.value
    setF((s) => ({ ...s, item, size: SIZES[item][0] }))
  }

  const due = num(f.price) + num(f.delivery) - num(f.advanced)

  const download = async () => {
    const el = sheetRef.current
    if (!el || busy) return
    setBusy(true)
    const prev = { width: el.style.width, maxWidth: el.style.maxWidth }
    el.style.width = '595px'
    el.style.maxWidth = '595px'
    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: `EZAARA-INV-${f.invoiceNo.trim() || 'NA'}-${f.date}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 595 },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save()
    } finally {
      el.style.width = prev.width
      el.style.maxWidth = prev.maxWidth
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#110005] font-sans text-[#1E0007] sm:py-8 pb-24 sm:pb-8">
      <div
        ref={sheetRef}
        className="mx-auto w-full max-w-[595px] bg-white px-6 py-10 sm:min-h-[842px]"
      >
        <header className="text-center">
          <h1 className="font-brand text-5xl font-light tracking-[0.3em] text-[#470000] pl-[0.3em] leading-none">EZAARA</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-gray-500 pl-[0.35em]">Invoice</p>
        </header>
        <hr className="my-6 border-0 border-t-[3px] border-[#470000]" />

        <div className="grid grid-cols-2 gap-6">
          <Field label="Invoice No.">
            <input className="field" value={f.invoiceNo} onChange={set('invoiceNo')} placeholder="001" />
          </Field>
          <Field label="Date">
            <input className="field" type="date" value={f.date} onChange={set('date')} />
          </Field>
        </div>
        <Rule />

        <Section>Customer Information</Section>
        <div className="space-y-3">
          <Field label="Name"><input className="field" value={f.name} onChange={set('name')} /></Field>
          <Field label="Address"><input className="field" value={f.address} onChange={set('address')} /></Field>
          <Field label="Mobile"><input className="field" type="tel" inputMode="tel" value={f.mobile} onChange={set('mobile')} /></Field>
        </div>
        <Rule />

        <Section>Order Details</Section>
        <div className="grid grid-cols-2 gap-6">
          <Field label="Item">
            <select className="field" value={f.item} onChange={setItem}>
              {Object.keys(SIZES).map((i) => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Size">
            <select className="field" value={f.size} onChange={set('size')}>
              {SIZES[f.item].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Rule />

        <Section>Payment Summary</Section>
        <div className="space-y-3">
          <Field label="Price"><input className="field" type="number" inputMode="decimal" min="0" value={f.price} onChange={set('price')} placeholder="0" /></Field>
          <Field label="Delivery Charge"><input className="field" type="number" inputMode="decimal" min="0" value={f.delivery} onChange={set('delivery')} placeholder="0" /></Field>
          <Field label="Advanced"><input className="field" type="number" inputMode="decimal" min="0" value={f.advanced} onChange={set('advanced')} placeholder="0" /></Field>
          <Field label="Due">
            <div className="flex min-h-[44px] items-center border-b-2 border-[#470000] text-lg font-bold text-[#470000]">
              {due.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
          </Field>
        </div>

        <hr className="my-6 border-0 border-t-[3px] border-[#470000]" />
        <footer className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
          {[
            ['facebook', FB, true, 'Facebook'],
            ['whatsapp', WA, true, 'WhatsApp'],
            ['instagram', IG, false, 'Instagram'],
          ].map(([k, d, fill, ph]) => (
            <div key={k} className="flex items-center gap-2 border-b border-[#d9cfd1] focus-within:border-[#470000]">
              <Icon d={d} fill={fill} />
              <input
                className="field !border-0 !text-[13px]"
                value={f[k]}
                onChange={set(k)}
                placeholder={ph}
                aria-label={ph}
              />
            </div>
          ))}
        </footer>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-[#110005]/95 p-3 sm:static sm:mt-6 sm:bg-transparent sm:p-0">
        <button
          onClick={download}
          disabled={busy}
          className="mx-auto block min-h-[48px] w-full max-w-[595px] bg-[#470000] text-sm font-medium uppercase tracking-[0.2em] text-white active:bg-[#5c0a0a] disabled:opacity-60"
        >
          {busy ? 'Preparing…' : 'Download PDF'}
        </button>
      </div>
    </div>
  )
}
