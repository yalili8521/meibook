import { IconX } from './Icons.jsx'

// Bottom sheet modal. Closes on backdrop tap or X.
export default function Sheet({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet-dim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">{title}</div>
          <button className="sheet-x" onClick={onClose} aria-label="关闭">
            <IconX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
