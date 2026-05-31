import { Inbox } from 'lucide-react'

export const EmptyState = ({ title = 'No records found', description = 'Try changing the filters or check again later.' }: { title?: string; description?: string }) =>
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center"><Inbox className="mb-3 h-10 w-10 text-slate-300" /><h3 className="font-bold text-slate-700">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></div>
