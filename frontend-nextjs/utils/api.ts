import { LOGIN } from '@/constants/routes';
import { TOKEN } from '@/constants/storage';

const api = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      Accept: '*/*',
      ...options.headers,
    };

    const authToken = localStorage.getItem(TOKEN);
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem(TOKEN);
          window.location.href = LOGIN;
        }
        throw new Error(`Erro na requisição: ${response.statusText} - ${errorDetails.message}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async postFile<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};

export default api;
