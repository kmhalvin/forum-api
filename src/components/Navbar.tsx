'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function Navbar() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const { data: session } = useSession()

  return (
    <nav className="border-b" data-testid="navbar">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" data-testid="nav-home-link">
          Trendy Tech
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2" data-testid="nav-cart-link">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span 
                className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                data-testid="cart-badge"
              >
                {itemCount}
              </span>
            )}
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" data-testid="nav-admin-link">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                data-testid="nav-logout-btn"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth/login" data-testid="nav-login-link">
              <Button variant="ghost" size="sm">
                <UserIcon className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
