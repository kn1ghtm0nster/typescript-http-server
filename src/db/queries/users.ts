import { eq } from 'drizzle-orm';

import { db } from '../index.js';
import { NewUser, users } from '../schema.js';

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return {
    id: result.id,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function resetUsersTable() {
  await db.delete(users).execute();
}
