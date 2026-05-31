import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('panel', className)} {...props} />
export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('flex items-center justify-between gap-3 p-5 pb-3', className)} {...props} />
export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn('text-base font-bold text-slate-900', className)} {...props} />
export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('p-5 pt-2', className)} {...props} />
