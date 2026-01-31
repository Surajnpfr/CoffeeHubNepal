import { VerificationRequest, VerificationRequestDocument, VerificationStatus } from '../models/VerificationRequest.js';
import { User } from '../models/User.js';

export interface VerificationRequestData {
  organizationName: string;
  roleDescription: string;
  location: string;
  yearsOfExperience: string;
  certification?: string;
  documentUrls: string[];
}

/** One verification request per user. Create or update (only when pending or rejected). */
export const createOrUpdateVerificationRequest = async (
  userId: string,
  data: VerificationRequestData
): Promise<VerificationRequestDocument> => {
  const existing = await VerificationRequest.findOne({ user: userId }).exec();
  if (existing) {
    if (existing.status === 'approved') {
      throw new Error('ALREADY_VERIFIED');
    }
    // pending or rejected: allow update (re-submit sets back to pending)
    existing.organizationName = data.organizationName;
    existing.roleDescription = data.roleDescription;
    existing.location = data.location;
    existing.yearsOfExperience = data.yearsOfExperience;
    existing.certification = data.certification ?? existing.certification;
    existing.documentUrls = data.documentUrls ?? existing.documentUrls;
    existing.status = 'pending';
    existing.submittedAt = new Date();
    existing.reviewedAt = undefined;
    existing.reviewedBy = undefined;
    existing.rejectionReason = undefined;
    return existing.save();
  }
  const doc = new VerificationRequest({
    user: userId,
    status: 'pending',
    organizationName: data.organizationName,
    roleDescription: data.roleDescription,
    location: data.location,
    yearsOfExperience: data.yearsOfExperience,
    certification: data.certification,
    documentUrls: data.documentUrls ?? []
  });
  return doc.save();
};

export const getVerificationRequestByUserId = async (userId: string) => {
  return VerificationRequest.findOne({ user: userId })
    .populate('user', 'name email phone location role verified')
    .lean();
};

export const getMyVerificationRequest = async (userId: string) => {
  return VerificationRequest.findOne({ user: userId }).lean();
};

/** For admin: list of verification requests with status pending, with user populated. */
export const getPendingVerificationRequests = async () => {
  return VerificationRequest.find({ status: 'pending' })
    .populate('user', 'name email phone location role verified createdAt')
    .sort({ submittedAt: -1 })
    .lean();
};

/** For admin: list verification requests with optional status filter, with user populated. */
export const getVerificationRequests = async (status?: 'pending' | 'approved' | 'rejected') => {
  const query = status ? { status } : {};
  return VerificationRequest.find(query)
    .populate('user', 'name email phone location role verified createdAt')
    .sort({ submittedAt: -1 })
    .lean();
};

export const updateVerificationStatus = async (
  userId: string,
  status: VerificationStatus,
  adminId: string,
  rejectionReason?: string
): Promise<VerificationRequestDocument | null> => {
  const req = await VerificationRequest.findOne({ user: userId }).exec();
  if (!req) return null;
  req.status = status;
  req.reviewedAt = new Date();
  req.reviewedBy = adminId as any;
  if (status === 'rejected' && rejectionReason) req.rejectionReason = rejectionReason;
  return req.save();
};
