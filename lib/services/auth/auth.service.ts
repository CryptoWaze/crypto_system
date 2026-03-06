import { getApiUrl } from '@/lib/config/api';
import type { LoginCredentials, LoginResult, UserResponse } from '@/lib/types/auth';
import { request } from '@/lib/services/api/http-client';

const LOGIN_PATH = '/users/login';

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
    const url = getApiUrl(LOGIN_PATH);
    const { data, error } = await request<UserResponse>('POST', url, {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
    });
    if (error) {
        return { success: false, message: error.message };
    }
    if (!data) {
        return { success: false, message: 'Resposta inválida do servidor.' };
    }
    return { success: true, user: data };
}
