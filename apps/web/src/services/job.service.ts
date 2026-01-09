export interface Job {
  id: number;
  title: string;
  farm: string;
  location: string;
  pay: string;
  type: string;
  description: string;
  requirements?: string;
  benefits?: string;
  createdAt: string;
  createdBy?: string; // User ID of the job creator
}

export interface Application {
  id: number;
  jobId: number;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export const jobService = {
  async getJobs(_filters?: { type?: string; location?: string }) {
    // TODO: Replace with actual API call
    return [];
  },

  async getJob(_id: number) {
    // TODO: Replace with actual API call
    return null;
  },

  async createJob(data: Omit<Job, 'id' | 'createdAt'>) {
    // TODO: Replace with actual API call
    return { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  },

  async applyToJob(_jobId: number, _applicationData?: { message?: string; phone?: string }) {
    // TODO: Replace with actual API call
    return { success: true, message: 'Application submitted successfully' };
  },

  async getMyJobs(_userId: string) {
    // TODO: Replace with actual API call
    return [];
  },

  async getApplications(_jobId: number) {
    // TODO: Replace with actual API call
    return [];
  },

  async getApplication(_applicationId: number) {
    // TODO: Replace with actual API call
    return null;
  },

  async acceptApplication(_applicationId: number) {
    // TODO: Replace with actual API call
    return { success: true, message: 'Application accepted successfully' };
  },

  async rejectApplication(_applicationId: number) {
    // TODO: Replace with actual API call
    return { success: true, message: 'Application rejected successfully' };
  }
};

