import { RoleName } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  roles: RoleName[];
}
