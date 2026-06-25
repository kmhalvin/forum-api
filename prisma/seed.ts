import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const testPassword = await bcrypt.hash('test1234', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: testPassword,
      role: 'USER',
    },
  })

  // Clear existing items to avoid duplicates on re-seed
  await prisma.item.deleteMany({})

  const items = [
    {
      name: 'Web Development Book',
      description: 'Learn the ins and outs of web development.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Clicky keys for faster test writing.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Ergonomic Mouse',
      description: 'Save your wrist while debugging.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Coffee Mug',
      description: 'Fuel for those late night deployments.',
      price: 15.0,
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
    },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: item,
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
