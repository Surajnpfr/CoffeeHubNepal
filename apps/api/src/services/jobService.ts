import { Job, JobDocument } from '../models/Job.js';
import { Application, ApplicationDocument, ApplicationStatus } from '../models/Application.js';
import mongoose from 'mongoose';

export interface CreateJobData {
  title: string;
  farm: string;
  location: string;
  pay: string;
  type: string;
  description: string;
  requirements?: string;
  benefits?: string;
}

export interface CreateApplicationData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  message?: string;
}

export const createJob = async (userId: string, data: CreateJobData): Promise<JobDocument> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const job = new Job({
    ...data,
    createdBy: new mongoose.Types.ObjectId(userId),
    active: true
  });

  return await job.save();
};

export const getJobs = async (filters?: {
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
  createdBy?: string;
}) => {
  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 50);
  const skip = (page - 1) * limit;

  const query: any = { active: true };

  if (filters?.type) {
    query.type = filters.type;
  }

  if (filters?.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }

  if (filters?.createdBy) {
    query.createdBy = new mongoose.Types.ObjectId(filters.createdBy);
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .select('title farm location pay type description requirements benefits createdBy active createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Job.countDocuments(query)
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getJobById = async (id: string): Promise<any> => {
  return await Job.findById(id)
    .select('title farm location pay type description requirements benefits createdBy active createdAt updatedAt')
    .lean();
};

export const updateJob = async (id: string, userId: string, data: Partial<CreateJobData>): Promise<any> => {
  const job = await Job.findById(id).lean();
  
  if (!job) {
    throw new Error('JOB_NOT_FOUND');
  }

  if (job.createdBy.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }

  const updated = await Job.findByIdAndUpdate(
    id,
    { ...data },
    { new: true, runValidators: true }
  ).lean();

  return updated;
};

export const deleteJob = async (id: string, userId: string): Promise<boolean> => {
  const job = await Job.findById(id).lean();
  
  if (!job) {
    throw new Error('JOB_NOT_FOUND');
  }

  if (job.createdBy.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }

  await Job.findByIdAndUpdate(id, { active: false });
  return true;
};

export const createApplication = async (jobId: string, userId: string, data: CreateApplicationData): Promise<ApplicationDocument> => {
  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job || !job.active) {
    throw new Error('JOB_NOT_FOUND');
  }

  // Check if user already applied
  const existing = await Application.findOne({
    jobId: new mongoose.Types.ObjectId(jobId),
    applicantId: new mongoose.Types.ObjectId(userId)
  });

  if (existing) {
    throw new Error('ALREADY_APPLIED');
  }

  const application = new Application({
    jobId: new mongoose.Types.ObjectId(jobId),
    applicantId: new mongoose.Types.ObjectId(userId),
    ...data,
    status: 'pending'
  });

  return await application.save();
};

export const getApplications = async (jobId: string, userId: string): Promise<any[]> => {
  // Verify user owns the job
  const job = await Job.findById(jobId).lean();
  if (!job || job.createdBy.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }

  return await Application.find({ jobId: new mongoose.Types.ObjectId(jobId) })
    .select('applicantName applicantEmail applicantPhone message status appliedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

export const updateApplicationStatus = async (
  applicationId: string,
  jobId: string,
  userId: string,
  status: ApplicationStatus
): Promise<any> => {
  // Verify user owns the job
  const job = await Job.findById(jobId).lean();
  if (!job || job.createdBy.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      status,
      reviewedAt: new Date(),
      reviewedBy: new mongoose.Types.ObjectId(userId)
    },
    { new: true }
  ).lean();

  if (!application) {
    throw new Error('APPLICATION_NOT_FOUND');
  }

  return application;
};

