/**
 * Application constants
 */

export const INVOICE_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  PENDING: 'pending',
} as const;

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.PAID]: 'Apmokėta',
  [INVOICE_STATUS.UNPAID]: 'Neapmokėta',
  [INVOICE_STATUS.PENDING]: 'Terminas nepasibaigęs',
} as const;

export const FILE_TYPES = {
  CSV: 'CSV',
  EXCEL: 'Excel',
  PDF: 'PDF',
} as const;

export const AI_MESSAGE_TONE = {
  NEUTRAL: 'neutral',
  FRIENDLY: 'friendly',
} as const;

export const AI_MESSAGE_TONE_LABELS = {
  [AI_MESSAGE_TONE.NEUTRAL]: 'Neutralus',
  [AI_MESSAGE_TONE.FRIENDLY]: 'Draugiškas',
} as const;

export const WEEKDAYS = [
  'Pirm',
  'Antr',
  'Treb',
  'Ketv',
  'Penkt',
  'Šešt',
  'Sekm',
] as const;

export const AI_MESSAGE_STATUS = {
  SENT: 'sent',
  OPENED: 'opened',
  NOT_DELIVERED: 'not_delivered',
} as const;

export const AI_MESSAGE_STATUS_LABELS = {
  [AI_MESSAGE_STATUS.SENT]: 'Išsiųsta',
  [AI_MESSAGE_STATUS.OPENED]: 'Atidaryta',
  [AI_MESSAGE_STATUS.NOT_DELIVERED]: 'Nepristatyta',
} as const;

