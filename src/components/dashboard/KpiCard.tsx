import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const KpiCard = ({ label, value, hint, icon: Icon, tone = 'sky' }: { label: string; value: string | number; hint?: string; icon: LucideIcon; tone?: string }) =>
  <Card className="overflow-hidden p-5">
    <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>{hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}</div><div className={tone === 'amber' ? 'rounded-xl bg-amber-50 p-3 text-amber-600' : tone === 'emerald' ? 'rounded-xl bg-emerald-50 p-3 text-emerald-600' : tone === 'violet' ? 'rounded-xl bg-violet-50 p-3 text-violet-600' : 'rounded-xl bg-sky-50 p-3 text-sky-600'}><Icon className="h-5 w-5" /></div></div>
  </Card>
