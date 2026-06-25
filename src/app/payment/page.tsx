'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || status === 'loading') return null

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="payment-unauthenticated">
        <h1 className="text-2xl font-bold mb-4">You must be logged in to checkout</h1>
        <Link href="/auth/login?callbackUrl=/payment">
          <Button data-testid="login-to-pay-btn">Log in to Continue</Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="payment-empty-cart">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/')}>Go Shopping</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate network delay for testing
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: getTotal(),
          items: items.map(i => ({ id: i.id, quantity: i.quantity }))
        }),
      })

      if (!response.ok) throw new Error('Payment failed')

      toast.success('Payment successful! Order placed.')
      clearCart()
      router.push('/payment/success')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center" data-testid="payment-page">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} data-testid="payment-form">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Total to pay: <strong data-testid="payment-total">${getTotal().toFixed(2)}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input id="name" required placeholder="John Doe" data-testid="payment-name-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" required placeholder="0000 0000 0000 0000" data-testid="payment-card-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" required placeholder="MM/YY" data-testid="payment-expiry-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" required placeholder="123" data-testid="payment-cvc-input" type="password" maxLength={4} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading} data-testid="payment-submit-btn">
              {loading ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
