import { LOGIN } from '@/constants/routes';
import { TOKEN } from '@/constants/storage';


const api = {
    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`;

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
      });
    },
  };
  
  export default api;
