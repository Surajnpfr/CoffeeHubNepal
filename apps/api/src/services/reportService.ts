import mongoose from 'mongoose';
import { Report, ReportDocument, ReportType, ReportStatus } from '../models/Report.js';
import { BlogPost } from '../models/BlogPost.js';
import { User } from '../models/User.js';

export interface CreateReportData {
  postId: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  type: ReportType;
}

export const createReport = async (data: CreateReportData): Promise<ReportDocument> => {
  // Validate post exists
  const post = await BlogPost.findById(data.postId);
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }

  // Validate users exist
  const [reporter, reportedUser] = await Promise.all([
    User.findById(data.reporterId),
    User.findById(data.reportedUserId)
  ]);

  if (!reporter || !reportedUser) {
    throw new Error('USER_NOT_FOUND');
  }

  // Check if user already reported this post
  const existingReport = await Report.findOne({
    postId: data.postId,
    reporterId: data.reporterId
  });

  if (existingReport) {
    throw new Error('ALREADY_REPORTED');
  }

  const report = await Report.create({
    postId: new mongoose.Types.ObjectId(data.postId),
    reporterId: new mongoose.Types.ObjectId(data.reporterId),
    reportedUserId: new mongoose.Types.ObjectId(data.reportedUserId),
    reason: data.reason,
    type: data.type,
    status: 'pending'
  });

  return report;
};

export const getReports = async (filters?: {
  status?: ReportStatus;
  type?: ReportType;
  page?: number;
  limit?: number;
}) => {
  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 50);
  const skip = (page - 1) * limit;

  const query: any = {};
  if (filters?.status) {
    query.status = filters.status;
  }
  if (filters?.type) {
    query.type = filters.type;
  }

  const [reports, total] = await Promise.all([
    Report.find(query)
      .populate('postId', 'title authorName')
      .populate('reporterId', 'name email')
      .populate('reportedUserId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Report.countDocuments(query)
  ]);

  return {
    reports,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const updateReportStatus = async (
  reportId: string,
  status: ReportStatus,
  reviewedBy: string
): Promise<ReportDocument> => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new Error('REPORT_NOT_FOUND');
  }

  report.status = status;
  report.reviewedBy = new mongoose.Types.ObjectId(reviewedBy);
  report.reviewedAt = new Date();
  await report.save();

  return report;
};

export const getReportsByPost = async (postId: string) => {
  const reports = await Report.find({ postId })
    .populate('reporterId', 'name email')
    .populate('reportedUserId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return reports;
};

