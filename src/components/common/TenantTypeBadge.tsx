import { Badge } from '@/components/ui/badge'
import type { TenantType } from '@/types/superadmin'

export const TenantTypeBadge = ({ type }: { type: TenantType }) => {
  const style = type === 'cafe' ? 'bg-orange-50 text-orange-700' : type === 'lodging' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'
  return <Badge className={style}>{type}</Badge>
}
