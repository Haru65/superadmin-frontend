import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'icon'
}

export const Button = ({ asChild, className, variant = 'default', size = 'default', ...props }: Props) => {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-50',
    variant === 'default' && 'bg-brand-600 text-white hover:bg-brand-700',
    variant === 'secondary' && 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    variant === 'outline' && 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
    variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
    size === 'default' && 'h-10 px-4 text-sm',
    size === 'sm' && 'h-8 px-3 text-xs',
    size === 'icon' && 'h-10 w-10',
    className,
  )} {...props} />
}
