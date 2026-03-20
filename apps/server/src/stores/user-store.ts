import type { User } from '@doodleshare/shared';
import { v4 as uuid } from 'uuid';

const users = new Map<string, User>();

export const userStore = {
  create(email: string | null, username: string): User {
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

  get(id: string): User | undefined {
    return users.get(id);
  },

  getAll(): User[] {
    return [...users.values()];
  },
};
