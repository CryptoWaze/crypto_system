import { getApiUrl } from '@/lib/config/api';
import type { TopToken } from '@/lib/types/token';

export async function getTop500Tokens(): Promise<TopToken[]> {
  const url = getApiUrl('tokens/top-500');
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}
