import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const items = await prisma.item.findMany()

  return (
    <div className="container mx-auto px-4 py-8" data-testid="home-page">
      <h1 className="text-3xl font-bold mb-8 text-center" data-testid="home-title">
        Welcome to Trendy Tech
      </h1>
      
      {items.length === 0 ? (
        <p className="text-center text-gray-500" data-testid="no-items-message">
          No items found in the database.
        </p>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          data-testid="product-grid"
        >
          {items.map((item: any) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
