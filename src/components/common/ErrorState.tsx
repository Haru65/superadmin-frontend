import { AlertTriangle } from 'lucide-react'
import type { SourceErrors } from '@/types/superadmin'

export const ErrorState = ({ errors }: { errors: SourceErrors }) => {
  const entries = Object.entries(errors)
  if (!entries.length) return null
  return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
    <div className="mb-1 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Partial data loaded</div>
    {entries.map(([source, message]) => <p key={source}><b className="capitalize">{source}:</b> {message}</p>)}
  </div>
}
