const I = ({ children, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const IconSun = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
  </I>
)

export const IconCalendar = (p) => (
  <I {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 9.5h17M8 2.8v4M16 2.8v4" />
  </I>
)

export const IconUsers = (p) => (
  <I {...p}>
    <circle cx="9" cy="8.2" r="3.4" />
    <path d="M3.2 19.5c.8-3.1 3.1-4.7 5.8-4.7s5 1.6 5.8 4.7" />
    <path d="M15.5 5.4a3.1 3.1 0 0 1 0 5.7M17.8 14.9c1.7.7 2.7 2 3.1 4" />
  </I>
)

export const IconChart = (p) => (
  <I {...p}>
    <path d="M4 20.5V13M10 20.5V6.5M16 20.5V10.5M21 20.5H3" />
  </I>
)

export const IconGear = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8l1 2.6 2.7-.6 1 2.4 2.6 1-.6 2.7 1.8 2.1-1.8 2.1.6 2.7-2.6 1-1 2.4-2.7-.6-1 2.6-1-2.6-2.7.6-1-2.4-2.6-1 .6-2.7L3.5 12l1.8-2.1-.6-2.7 2.6-1 1-2.4 2.7.6z" />
  </I>
)

export const IconPlus = (p) => (
  <I {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
)

export const IconCopy = (p) => (
  <I {...p}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
    <path d="M5.5 15.5h-1a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 4.5 3.5H14A1.5 1.5 0 0 1 15.5 5v1" />
  </I>
)

export const IconCheck = (p) => (
  <I {...p}>
    <path d="M4.5 12.8l4.6 4.6L19.5 7" />
  </I>
)

export const IconX = (p) => (
  <I {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </I>
)

export const IconBack = (p) => (
  <I {...p}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </I>
)

export const IconChevR = (p) => (
  <I {...p}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </I>
)

export const IconSearch = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </I>
)

export const IconCard = (p) => (
  <I {...p}>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.6" />
    <path d="M2.8 10h18.4M6.5 14.8h4" />
  </I>
)

export const IconCash = (p) => (
  <I {...p}>
    <rect x="2.8" y="6.5" width="18.4" height="11" rx="2.2" />
    <circle cx="12" cy="12" r="2.7" />
    <path d="M6 9.6v.01M18 14.4v.01" />
  </I>
)

export const IconSend = (p) => (
  <I {...p}>
    <path d="M21 3.5L10.2 14.3M21 3.5l-6.8 17-3.9-7.2L3 9.4z" />
  </I>
)

export const IconBell = (p) => (
  <I {...p}>
    <path d="M18 10a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
    <path d="M10 20a2.2 2.2 0 0 0 4 0" />
  </I>
)

export const IconDownload = (p) => (
  <I {...p}>
    <path d="M12 3.5v11M7.5 10l4.5 4.5L16.5 10M4 20.5h16" />
  </I>
)

export const IconUpload = (p) => (
  <I {...p}>
    <path d="M12 14.5v-11M7.5 8L12 3.5 16.5 8M4 20.5h16" />
  </I>
)

export const IconEdit = (p) => (
  <I {...p}>
    <path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17z" />
    <path d="M14.5 7l3 3" />
  </I>
)
