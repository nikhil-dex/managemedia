import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
  certificateNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  issueDate: Date;
  status: "valid" | "revoked";
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    internship: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["valid", "revoked"],
      default: "valid",
    },
  },
  {
    timestamps: true,
  }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;