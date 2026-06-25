import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  const anyUser = session.user as any
  if (anyUser?.role !== 'ADMIN') {
    // For simplicity, we redirect non-admins back to home
    redirect('/')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true
    }
  })

  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
  })

  return (
    <div className="container mx-auto px-4 py-8" data-testid="admin-dashboard">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminDashboardClient orders={orders} users={users} />
    </div>
  )
}
