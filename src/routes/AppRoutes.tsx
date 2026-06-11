import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { LoadingState } from '@/components/common/LoadingState'
import { ProtectedRoute } from './ProtectedRoute'

const Dashboard = lazy(() => import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard })))
const Login = lazy(() => import('@/pages/Login').then((module) => ({ default: module.Login })))
const Orders = lazy(() => import('@/pages/Orders').then((module) => ({ default: module.Orders })))
const PaymentConfig = lazy(() => import('@/pages/PaymentConfig').then((module) => ({ default: module.PaymentConfig })))
const Revenue = lazy(() => import('@/pages/Revenue').then((module) => ({ default: module.Revenue })))
const Settings = lazy(() => import('@/pages/Settings').then((module) => ({ default: module.Settings })))
const Subscriptions = lazy(() => import('@/pages/Subscriptions').then((module) => ({ default: module.Subscriptions })))
const TenantDetailsPage = lazy(() => import('@/pages/TenantDetailsPage').then((module) => ({ default: module.TenantDetailsPage })))
const Tenants = lazy(() => import('@/pages/Tenants').then((module) => ({ default: module.Tenants })))
const Users = lazy(() => import('@/pages/Users').then((module) => ({ default: module.Users })))

export const AppRoutes = () => <Suspense fallback={<div className="p-6"><LoadingState /></div>}><Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<SuperAdminLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/tenants/:id" element={<TenantDetailsPage />} />
      <Route path="/users" element={<Users />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/payment-config" element={<PaymentConfig />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Route>
  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes></Suspense>
