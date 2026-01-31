import mongoose, { Document, Schema } from 'mongoose';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRequestDocument extends Document {
  user: mongoose.Types.ObjectId;
  status: VerificationStatus;
  organizationName: string;
  roleDescription: string;
  location: string;
  yearsOfExperience: string;
  certification?: string;
  /** Data URLs (base64) or URLs of uploaded documents */
  documentUrls: string[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const verificationRequestSchema = new Schema<VerificationRequestDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    organizationName: { type: String, required: true, trim: true },
    roleDescription: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    yearsOfExperience: { type: String, required: true, trim: true },
    certification: { type: String, trim: true },
    documentUrls: [{ type: String }],
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String }
  },
  { timestamps: true }
);

verificationRequestSchema.index({ user: 1 }, { unique: true });
verificationRequestSchema.index({ status: 1 });

export const VerificationRequest = mongoose.model<VerificationRequestDocument>(
  'VerificationRequest',
  verificationRequestSchema
);
