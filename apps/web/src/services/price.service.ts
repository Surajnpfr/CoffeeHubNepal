import { API_BASE_URL } from '@/utils/constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export interface Price {
  _id: string;
  id?: string; // For backward compatibility
  variety: string;
  price: number;
  change?: string;
  trend: 'up' | 'down' | 'stable';
  image?: string;
  updatedAt: string;
  previousPrice?: number;
  updatedBy?: string;
  updatedByName?: string;
}

export const priceService = {
  async getPrices(): Promise<Price[]> {
    const response = await fetch(`${API_BASE_URL}/prices`);
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    const prices = await response.json();
    return prices.map((price: Price) => ({ ...price, id: price._id }));
  },

  async getPrice(id: string): Promise<Price | null> {
    const response = await fetch(`${API_BASE_URL}/prices/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch price');
    }
    const price = await response.json();
    return { ...price, id: price._id };
  },

  // Moderator only - Create price
  async createPrice(data: { variety: string; price: number; image?: string }): Promise<Price> {
    const response = await fetch(`${API_BASE_URL}/prices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create price');
    }

    const price = await response.json();
    return { ...price, id: price._id };
  },

  // Moderator only - Update price by ID
  async updatePrice(id: string, newPrice?: number, image?: string): Promise<Price> {
    const response = await fetch(`${API_BASE_URL}/prices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ price: newPrice, image })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update price');
    }

    const price = await response.json();
    return { ...price, id: price._id };
  },

  // Moderator only - Update price by variety
  async updatePriceByVariety(variety: string, newPrice: number): Promise<Price> {
    const response = await fetch(`${API_BASE_URL}/prices/variety/${encodeURIComponent(variety)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ price: newPrice })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update price');
    }

    const price = await response.json();
    return { ...price, id: price._id };
  },

  // Moderator only - Delete price
  async deletePrice(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/prices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete price');
    }

    return true;
  }
};

