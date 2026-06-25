import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center" data-testid="payment-success-page">
      <div className="text-center space-y-6 max-w-md">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Order Successful!</h1>
        <p className="text-gray-500">
          Thank you for your purchase. Your mock order has been placed and saved to the database.
        </p>
        <div className="pt-4 space-x-4">
          <Link href="/">
            <Button data-testid="success-home-btn">Return Home</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" data-testid="success-admin-btn">View in Admin</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
