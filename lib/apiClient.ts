// lib/apiClient.ts

const BASE_URL = '/api'; // This assumes your API routes are at /api/...

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  
  // Return null for 204 No Content (common for DELETE)
  if (response.status === 204) return null;
  
  return response.json();
}

export const apiClient = {
  // GET request
  async get(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // POST request
  async post(endpoint: string, data: any) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // DELETE request
  async delete(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // PUT request (if you need it later)
  async put(endpoint: string, data: any) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
};
