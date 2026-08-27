import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model,
} from "mongoose";

export type DocumentType =
  | "offer-letter"
  | "joining-letter"
  | "lor";

export type DocumentStatus =
  | "valid"
  | "revoked";

export interface IDocument
  extends MongooseDocument {
  documentNumber: string;
  documentType: DocumentType;

  name: string;
  internship: string;
  duration: string;

  startDate: Date;
  endDate: Date;
  issueDate: Date;

  workMode?: string;

  status: DocumentStatus;
}

const DocumentSchema =
  new Schema<IDocument>(
    {
      /*
       * ========================================
       * DOCUMENT NUMBER
       * ========================================
       */

      documentNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
      },

      /*
       * ========================================
       * DOCUMENT TYPE
       * ========================================
       */

      documentType: {
        type: String,
        required: true,
        enum: [
          "offer-letter",
          "joining-letter",
          "lor",
        ],
      },

      /*
       * ========================================
       * INTERN DETAILS
       * ========================================
       */

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

      /*
       * ========================================
       * DATES
       * ========================================
       */

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

      /*
       * ========================================
       * WORK MODE
       * ========================================
       */

      workMode: {
        type: String,
        trim: true,
      },

      /*
       * ========================================
       * STATUS
       * ========================================
       */

      status: {
        type: String,
        enum: [
          "valid",
          "revoked",
        ],
        default: "valid",
      },
    },
    {
      timestamps: true,
    }
  );

/*
 * ==========================================
 * MODEL
 * ==========================================
 *
 * Prevents Mongoose from recompiling the
 * model during Next.js development reloads.
 */

const Document: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>(
    "Document",
    DocumentSchema
  );

export default Document;