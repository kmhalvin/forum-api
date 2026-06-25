import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface Item {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface CartItem extends Item {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Item) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter((i) => i.id !== itemId),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
