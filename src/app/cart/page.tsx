'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, clearCart, getTotal } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="cart-page-loading">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p>Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="cart-page">
      <h1 className="text-3xl font-bold mb-8" data-testid="cart-title">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12" data-testid="empty-cart-message">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/">
            <Button data-testid="continue-shopping-btn">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4" data-testid="cart-items-list">
            {items.map((item) => (
              <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                <CardContent className="flex items-center p-4">
                  <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold" data-testid={`cart-item-name-${item.id}`}>{item.name}</h3>
                    <p className="text-gray-500" data-testid={`cart-item-price-${item.id}`}>${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-lg" data-testid={`cart-item-total-${item.id}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeItem(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6" data-testid="cart-summary">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="cart-subtotal">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span data-testid="cart-shipping">Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="cart-total">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <Link href="/payment" className="w-full block">
                  <Button className="w-full" data-testid="checkout-btn">Proceed to Checkout</Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearCart}
                  data-testid="clear-cart-btn"
                >
                  Clear Cart
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
