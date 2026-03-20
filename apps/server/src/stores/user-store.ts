import type { User } from '@doodleshare/shared';
import { v4 as uuid } from 'uuid';

const users = new Map<string, User>();

export const userStore = {
  create(email: string | null, username: string): User {
    // Return existing user if same email (idempotent login)
    if (email) {
      const existing = [...users.values()].find(u => u.email === email);
      if (existing) return existing;
    }

    const user: User = {
      id: uuid(),
      email,
      username,
      avatar_url: null,
      created_at: new Date().toISOString(),
    };
    users.set(user.id, user);
    return user;
  },

  /** Find or create by ID — for restoring sessions from client-stored IDs */
  getOrCreate(id: string, username: string): User {
    const existing = users.get(id);
    if (existing) return existing;
    const user: User = { id, email: null, username, avatar_url: null, created_at: new Date().toISOString() };
    users.set(id, user);
    return user;
  },

  get(id: string): User | undefined {
    return users.get(id);
  },

  getAll(): User[] {
    return [...users.values()];
  },
};
