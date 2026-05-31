import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { SubscriptionsTable } from '@/components/subscriptions/SubscriptionsTable'
import type { SourceErrors, Subscription } from '@/types/superadmin'

export const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [errors, setErrors] = useState<SourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<{ subscription: Subscription; action: 'renew' | 'suspend' | 'activate' }>()
  const load = async () => { setLoading(true); const result = await superadminService.getSubscriptions(); setSubscriptions(result.data); setErrors(result.errors); setLoading(false) }
  useEffect(() => { void load() }, [])
  return <><PageHeader title="Subscriptions" description="Monitor plans, grace periods, overdue accounts, and suspensions." /><ErrorState errors={errors} /><div className="mt-5">{loading ? <LoadingState /> : subscriptions.length ? <SubscriptionsTable subscriptions={subscriptions} onAction={(subscription, action) => setPending({ subscription, action })} /> : <EmptyState title="No subscriptions found" />}</div><ConfirmDialog open={Boolean(pending)} title={`${pending?.action || 'Update'} subscription?`} description={`Apply this change to ${pending?.subscription.tenantName || 'the selected tenant'}?`} destructive={pending?.action === 'suspend'} onCancel={() => setPending(undefined)} onConfirm={async () => { if (!pending) return; try { await superadminService.updateSubscription(pending.subscription.id, { action: pending.action }); toast.success('Subscription updated'); await load() } catch (error) { toast.error(error instanceof Error ? error.message : 'Update failed') } finally { setPending(undefined) } }} /></>
}
