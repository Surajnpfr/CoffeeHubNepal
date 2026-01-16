import mongoose, { Schema, Document } from 'mongoose';

export type ContactStatus = 'open' | 'pending' | 'closed';
export type ContactDocType = 'contact' | 'notification';

export interface ContactDocument extends Document {
  docType: ContactDocType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  assignedTo?: string;
  respondedAt?: Date;
  respondedBy?: string;
  // Notification-specific fields
  userId?: mongoose.Types.ObjectId; // User who should receive the notification
  notificationType?: 'listing_removed' | 'listing_approved' | 'other';
  relatedId?: string; // ID of related entity (e.g., listing ID)
  read?: boolean; // Whether notification has been read
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<ContactDocument>(
  {
    docType: { 
      type: String, 
      enum: ['contact', 'notification'], 
      default: 'contact', 
      required: true,
      index: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['open', 'pending', 'closed'], 
      default: 'open' 
    },
    adminNotes: { type: String },
    assignedTo: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: String },
    // Notification-specific fields
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      index: true
    },
    notificationType: {
      type: String,
      enum: ['listing_removed', 'listing_approved', 'other']
    },
    relatedId: { type: String },
    read: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// Use the existing 'reports' collection to avoid exceeding Cosmos DB throughput limits
// Also supports notifications stored in the same collection
contactSchema.index({ docType: 1, userId: 1, read: 1 });
contactSchema.index({ docType: 1, createdAt: -1 });
export const Contact = mongoose.model<ContactDocument>('Contact', contactSchema, 'reports');

