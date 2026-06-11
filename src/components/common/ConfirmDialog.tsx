import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

type Props = { open: boolean; title: string; description: string; confirmLabel?: string; destructive?: boolean; onCancel: () => void; onConfirm: () => void }
export const ConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', destructive, onCancel, onConfirm }: Props) =>
  <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
    <DialogContent>
      <DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>
      <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button variant={destructive ? 'destructive' : 'default'} onClick={onConfirm}>{confirmLabel}</Button></div>
    </DialogContent>
  </Dialog>
