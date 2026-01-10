import { API_BASE_URL } from '@/utils/constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export interface Job {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  farm: string;
  location: string;
  pay: string;
  type: string;
  description: string;
  requirements?: string;
  benefits?: string;
  createdAt: string;
  createdBy?: string;
  active?: boolean;
}

export interface Application {
  _id: string;
  id?: string; // For backward compatibility
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export interface JobListResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const jobService = {
  async getJobs(filters?: { type?: string; location?: string; page?: number; limit?: number; createdBy?: string }): Promise<JobListResponse> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.createdBy) params.append('createdBy', filters.createdBy);

    const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    // Add id for backward compatibility
    return {
      ...data,
      jobs: data.jobs.map((job: Job) => ({ ...job, id: job._id }))
    };
  },

  async getJob(id: string): Promise<Job | null> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch job');
    }
    const job = await response.json();
    return { ...job, id: job._id };
  },

  async createJob(data: Omit<Job, '_id' | 'id' | 'createdAt'>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create job');
    }

    const job = await response.json();
    return { ...job, id: job._id };
  },

  async applyToJob(jobId: string, applicationData?: { message?: string; phone?: string; applicantName?: string; applicantEmail?: string }): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData || {})
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to apply to job');
    }

    const application = await response.json();
    return { ...application, id: application._id, jobId };
  },

  async getMyJobs(userId: string): Promise<Job[]> {
    const result = await this.getJobs({ createdBy: userId, limit: 1000 });
    return result.jobs;
  },

  async getApplications(jobId: string): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    const applications = await response.json();
    return applications.map((app: Application) => ({ ...app, id: app._id }));
  },

  async acceptApplication(jobId: string, applicationId: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: 'accepted' })
    });

    if (!response.ok) {
      throw new Error('Failed to accept application');
    }

    const application = await response.json();
    return { ...application, id: application._id };
  },

  async rejectApplication(jobId: string, applicationId: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: 'rejected' })
    });

    if (!response.ok) {
      throw new Error('Failed to reject application');
    }

    const application = await response.json();
    return { ...application, id: application._id };
  }
};

