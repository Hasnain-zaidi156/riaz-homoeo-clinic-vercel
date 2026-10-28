/* =====================================================
   Local SVG icons — Font Awesome CDN / emojis ki jagah.
   Sab stroke-based (feather style), currentColor se colour lete hain,
   is liye inline CSS (.gold, .loc-row svg waghera) pehle jaisa hi chalta hai.
   ===================================================== */
const S = ({ size = 16, className, style, children, filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ flexShrink: 0, ...style }} aria-hidden="true">
    {children}
  </svg>
)

/* ✦ — 4-point star */
export const Star4 = p => (
  <S {...p}><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z" /></S>
)

/* ✨ — sparkles */
export const Sparkles = p => (
  <S {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    <path d="M5.5 15.5l.5 1.6 1.6.5-1.6.5-.5 1.6-.5-1.6-1.6-.5 1.6-.5.5-1.6z" />
  </S>
)

/* 🍄 — mushroom */
export const Mushroom = p => (
  <S {...p}>
    <path d="M4 10.5a8 8 0 0 1 16 0c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 13 4 11.9 4 10.5z" />
    <path d="M9.6 13l-.3 6.6a2.2 2.2 0 0 0 4.4 0L13.4 13" />
    <circle cx="9" cy="7.5" r="1" /><circle cx="14.6" cy="6.6" r="1.3" />
  </S>
)

/* 💊 — capsule / pill */
export const Capsule = p => (
  <S {...p}>
    <path d="M10.5 20.5l-7-7a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z" />
    <path d="M8.5 8.5l7 7" />
  </S>
)

/* 📋 — clipboard */
export const Clipboard = p => (
  <S {...p}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </S>
)

/* pulse / heartbeat (fa-heartbeat) */
export const Heartbeat = p => (
  <S {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></S>
)

/* ⭐ fa-star */
export const Star = p => (
  <S {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></S>
)

/* fa-check-circle */
export const CheckCircle = p => (
  <S {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </S>
)

/* fa-info-circle */
export const InfoCircle = p => (
  <S {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></S>
)

/* fa-user */
export const User = p => (
  <S {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></S>
)

/* fa-phone */
export const Phone = p => (
  <S {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></S>
)

/* fa-clock */
export const Clock = p => (
  <S {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></S>
)

/* fa-location-dot / fa-map-marker-alt */
export const MapPin = p => (
  <S {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></S>
)

/* fa-stethoscope */
export const Stethoscope = p => (
  <S {...p}>
    <path d="M6 2v7a6 6 0 0 0 12 0V2" />
    <path d="M12 15v2a4 4 0 0 0 4 4" />
    <circle cx="18.5" cy="21" r="2" />
  </S>
)

/* fa-seedling / sprout */
export const Sprout = p => (
  <S {...p}>
    <path d="M12 21v-9" />
    <path d="M12 12C12 8 9.2 5 4.5 5c0 5 3.2 7 7.5 7z" />
    <path d="M12 9.5c0-3.6 2.6-6 6.8-6 0 4.2-2.9 6-6.8 6z" />
  </S>
)

/* WhatsApp — bubble + handset */
export const WhatsApp = p => (
  <S {...p}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M9.2 8.6c.7 2.1 2 3.4 4 4l1.1-1.5 1.8 1.1-.6 1.5c-2.4 0-5.6-3-6-5.4l1.4-.9z" />
  </S>
)

/* fa-facebook-f */
export const Facebook = p => (
  <S {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></S>
)

/* fa-cart-plus */
export const CartPlus = p => (
  <S {...p}>
    <circle cx="9" cy="20" r="1.6" /><circle cx="17.5" cy="20" r="1.6" />
    <path d="M2 3h2.6l2.1 11.3a1.9 1.9 0 0 0 1.9 1.6h8.4a1.9 1.9 0 0 0 1.9-1.6L20.2 8H6" />
    <path d="M16.2 3.2v4M14.2 5.2h4" />
  </S>
)

/* fa-times */
export const Times = p => <S {...p}><path d="M18 6 6 18M6 6l12 12" /></S>

/* fa-chevron-down / left / right */
export const ChevronDown = p => <S {...p}><polyline points="6 9 12 15 18 9" /></S>
export const ChevronLeft = p => <S {...p}><polyline points="15 18 9 12 15 6" /></S>
export const ChevronRight = p => <S {...p}><polyline points="9 18 15 12 9 6" /></S>

/* fa-trash-alt */
export const Trash = p => (
  <S {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </S>
)

/* fa-shopping-bag / basket */
export const Bag = p => (
  <S {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </S>
)

/* fa-save */
export const Save = p => (
  <S {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </S>
)

/* fa-pencil-alt / edit */
export const Pencil = p => (
  <S {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></S>
)

/* fa-play */
export const Play = p => <S {...p}><polygon points="5 3 19 12 5 21 5 3" /></S>

/* fa-comment (product comments) */
export const Comment = p => <S {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></S>

/* fa-volume-up / fa-volume-xmark */
export const VolumeUp = p => (
  <S {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></S>
)
export const VolumeMute = p => (
  <S {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></S>
)

/* fa-expand */
export const Expand = p => (
  <S {...p}><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></S>
)

/* ---- Admin panel icons ---- */
export const Plus = p => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const ImageIcon = p => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></S>
export const Upload = p => <S {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><path d="M12 3v12" /></S>
export const Eye = p => <S {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></S>
export const EyeOff = p => <S {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></S>
export const Search = p => <S {...p}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></S>
export const LogOut = p => <S {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><path d="M21 12H9" /></S>
export const Grid = p => <S {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></S>
export const Calendar = p => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></S>
export const Package = p => <S {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></S>
export const Check = p => <S {...p}><polyline points="20 6 9 17 4 12" /></S>
export const Menu = p => <S {...p}><path d="M3 12h18M3 6h18M3 18h18" /></S>
export const ExternalLink = p => <S {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><path d="M10 14 21 3" /></S>
export const Alert = p => <S {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></S>
