import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateUserModal } from '@/components/users/CreateUserModal'
import { EditUserModal } from '@/components/users/EditUserModal'
import { UsersTable } from '@/components/users/UsersTable'
import type { SourceErrors, SuperAdminUser, Tenant } from '@/types/superadmin'

export const Users = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [users, setUsers] = useState<SuperAdminUser[]>([])
  const [errors, setErrors] = useState<SourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<SuperAdminUser>()
  const [deleting, setDeleting] = useState<SuperAdminUser>()
  const load = async () => { setLoading(true); const tenantResult = await superadminService.getTenants(); const userResult = await superadminService.getUsers(tenantResult.data); setTenants(tenantResult.data); setUsers(userResult.data); setErrors({ ...tenantResult.errors, ...userResult.errors }); setLoading(false) }
  useEffect(() => { void load() }, [])
  const filtered = useMemo(() => users.filter((user) => [user.name, user.email, user.tenantName, user.role].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()))), [users, search])
  return <><PageHeader title="Users" description="Manage admins, managers, staff, and lodging roles from one page." actions={<Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" />Create user</Button>} /><ErrorState errors={errors} /><div className="relative my-5 max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>{loading ? <LoadingState /> : filtered.length ? <UsersTable users={filtered} onEdit={setEditing} onToggle={async (user) => { try { await superadminService.updateUser(user.id, { isActive: user.status !== 'active', status: user.status === 'active' ? 'inactive' : 'active' }); toast.success('User status updated'); await load() } catch (error) { toast.error(error instanceof Error ? error.message : 'Update failed') } }} onReset={async (user) => { const password = window.prompt(`Temporary password for ${user.name}`); if (!password) return; try { await superadminService.resetPassword(user.id, password); toast.success('Password reset') } catch (error) { toast.error(error instanceof Error ? error.message : 'Reset failed') } }} onDelete={setDeleting} /> : <EmptyState title="No users found" />}<CreateUserModal open={creating} tenants={tenants} onClose={() => setCreating(false)} onCreated={() => void load()} /><EditUserModal open={Boolean(editing)} user={editing} tenants={tenants} onClose={() => setEditing(undefined)} onSaved={() => void load()} /><ConfirmDialog open={Boolean(deleting)} title="Delete user?" description={`Delete ${deleting?.name || 'this user'}? This cannot be undone.`} destructive confirmLabel="Delete" onCancel={() => setDeleting(undefined)} onConfirm={async () => { if (!deleting) return; try { await superadminService.deleteUser(deleting.id); toast.success('User deleted'); await load() } catch (error) { toast.error(error instanceof Error ? error.message : 'Delete failed') } finally { setDeleting(undefined) } }} /></>
}
