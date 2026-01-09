import { API_BASE_URL } from '@/utils/constants';

export type ReportType = 'spam' | 'inappropriate' | 'fraud' | 'harassment' | 'other';

export interface ReportPostData {
  reason: string;
  type: ReportType;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const reportService = {
  async reportPost(postId: string, data: ReportPostData): Promise<{ id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/blog/${postId}/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to report posts');
      }
      if (response.status === 409) {
        throw new Error(result.message || 'You have already reported this post');
      }
      if (response.status === 404) {
        throw new Error('Post not found');
      }
      throw new Error(result.error || 'Failed to report post');
    }

    return result;
  }
};

