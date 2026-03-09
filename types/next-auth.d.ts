import type { UserResponse } from '@/lib/types/auth';

declare module 'next-auth' {
    interface Session {
        user: UserResponse;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends UserResponse {}
}
