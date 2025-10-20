import 'dotenv/config'
import { Client } from 'pg'
import { eq } from 'drizzle-orm'
import { hash } from 'argon2'
import { drizzle } from 'drizzle-orm/node-postgres'

import { users } from '@/users/schemas/user.schema'
import { UserRoleEnum } from '@/users/enums/user-role.enum'

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
})

const db = drizzle(client)

async function seed() {
  await client.connect()

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.role, UserRoleEnum.ADMIN))
  if (existing.length === 0) {
    const hashPass = await hash('password')

    await db.insert(users).values({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashPass,
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
    })
    console.log('✅ Admin user created')
  } else {
    console.log('Admin already exists')
  }
  await client.end()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
