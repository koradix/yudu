export const PLATFORM_FEE = 0.15
export const EXPERT_PAYOUT = 0.85
export const PAYMENT_RELEASE_HOURS = 48
export const REQUEST_EXPIRE_HOURS = 48
export const MIN_PROPOSAL_RATIO = 0.50
export const CANCELLATION_FREE_HOURS = 24

export const OFFER_TYPE_LABELS = {
  practical_experience: 'Experiência Prática',
  hourly_mentoring: 'Mentoria por Hora',
  service: 'Serviço',
} as const

export const SKILL_CATEGORY_STYLES = {
  digital: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
  physical: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    iconBg: 'bg-teal-100',
  },
} as const
