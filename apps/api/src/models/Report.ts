import mongoose, { Document, Schema } from 'mongoose';

export type ReportType = 'spam' | 'inappropriate' | 'fraud' | 'harassment' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'resolved';

export interface ReportDocument extends Document {
  postId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  reason: string;
  type: ReportType;
  status: ReportStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
      index: true
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['spam', 'inappropriate', 'fraud', 'harassment', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed', 'resolved'],
      default: 'pending',
      index: true
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

reportSchema.index({ postId: 1, status: 1 });
reportSchema.index({ createdAt: -1 });

export const Report = mongoose.model<ReportDocument>('Report', reportSchema);

