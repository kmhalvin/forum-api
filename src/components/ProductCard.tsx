'use client'

import Image from 'next/image'
import { Item } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

export function ProductCard({ item }: { item: Item }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(item)
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <Card className="flex flex-col h-full" data-testid={`product-card-${item.id}`}>
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle data-testid={`product-title-${item.id}`}>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500" data-testid={`product-desc-${item.id}`}>
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-bold" data-testid={`product-price-${item.id}`}>
          ${item.price.toFixed(2)}
        </span>
        <Button onClick={handleAddToCart} data-testid={`add-to-cart-${item.id}`}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
