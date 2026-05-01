export type OcrDocumentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type OcrDocumentType = "INVOICE" | "PRESCRIPTION";

export interface OcrExtractedField {
  key: string;
  value: string;
  confidence: number;
}

export interface OcrDocument {
  id: string;
  branchId: string;
  documentType: OcrDocumentType;
  status: OcrDocumentStatus;
  originalFileName?: string;
  fileUrl?: string;
  confidence?: number; // overall confidence 0–1
  extractedData?: Record<string, string>; // key/value map of extracted fields
  correctedData?: Record<string, string>; // after review
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OcrDocumentListParams {
  branchId?: string;
  status?: OcrDocumentStatus;
  documentType?: OcrDocumentType;
  page?: number;
  limit?: number;
}

export interface UploadOcrDocumentPayload {
  file: File;
  documentType: OcrDocumentType;
  branchId: string;
}

export interface ReviewOcrDocumentPayload {
  correctedData: Record<string, string>;
}
