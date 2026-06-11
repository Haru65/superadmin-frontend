import { Skeleton } from '@/components/ui/skeleton'

export const LoadingState = ({ rows = 5 }: { rows?: number }) =>
  <div className="space-y-3">{Array.from({ length: rows }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>
