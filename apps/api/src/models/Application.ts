import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface ApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  message?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    applicantName: {
      type: String,
      required: true,
      trim: true
    },
    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    applicantPhone: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Performance indexes
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ applicantId: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

export const Application = mongoose.model<ApplicationDocument>('Application', applicationSchema);

