import { Badge } from '@/components/ui/badge'

export const StatusBadge = ({ status }: { status?: string }) => {
  const value = String(status || 'unknown').toLowerCase()
  const style = value === 'active' || value === 'paid'
    ? 'bg-emerald-50 text-emerald-700'
    : value === 'grace' || value === 'pending' || value === 'paused'
      ? 'bg-amber-50 text-amber-700'
      : value === 'inactive' || value === 'unpaid'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-red-50 text-red-700'
  return <Badge className={style}>{value}</Badge>
}
