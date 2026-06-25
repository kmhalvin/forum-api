import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // For testing purposes, we allow anonymous orders if not logged in
    const anyUser = session?.user as any
    if (!anyUser?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to place an order.' }, { status: 401 })
    }
    
    const userId = anyUser.id

    const body = await request.json()
    const { total, items } = body

    if (!total || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: total,
        status: 'COMPLETED',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
