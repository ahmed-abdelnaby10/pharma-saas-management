import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit2,
  X,
  ScanLine,
  ClipboardList,
} from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useApp } from "@/app/contexts/useApp";
import {
  useOcrDocumentsQuery,
  useUploadOcrDocumentMutation,
  useTriggerOcrMutation,
  useReviewOcrDocumentMutation,
  useOcrDocumentQuery,
} from "@/features/client/ocr/api";
import type {
  OcrDocument,
  OcrDocumentType,
  OcrDocumentStatus,
} from "@/features/client/ocr/api";

// ─── Map OCR extractedData to prescription form fields ────────────────────────

function mapOcrToPrescription(
  extractedData: Record<string, string>,
  docId: string,
) {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      if (extractedData[k]) return extractedData[k];
    }
    return "";
  };
  return {
    ocrDocumentId: docId,
    doctorName:    get("doctor_name", "doctorName", "doctor"),
    doctorLicense: get("doctor_license", "doctorLicense", "license"),
    issuedDate:    get("issued_date", "issuedDate", "issue_date"),
    expiryDate:    get("expiry_date", "expiryDate", "expiry"),
    notes:         get("notes", "note"),
  };
}

// ─── Confidence bar ───────────────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    value >= 0.8 ? "bg-green-500" : value >= 0.6 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OcrDocumentStatus,
  { label: string; color: string; Icon: React.ElementType }
> = {
  PENDING: { label: "Pending", color: "text-gray-500", Icon: Clock },
  PROCESSING: { label: "Processing", color: "text-blue-600", Icon: Loader2 },
  COMPLETED: { label: "Completed", color: "text-green-600", Icon: CheckCircle },
  FAILED: { label: "Failed", color: "text-red-600", Icon: AlertCircle },
};

function StatusBadge({ status }: { status: OcrDocumentStatus }) {
  const { label, color, Icon } = STATUS_CONFIG[status];
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  documentId,
  onClose,
}: {
  documentId: string;
  onClose: () => void;
}) {
  const { data: doc } = useOcrDocumentQuery(documentId);
  const reviewMutation = useReviewOcrDocumentMutation();
  const [fields, setFields] = useState<Record<string, string>>(
    () => doc?.correctedData ?? doc?.extractedData ?? {},
  );

  // Sync when doc loads
  React.useEffect(() => {
    if (doc) {
      setFields(doc.correctedData ?? doc.extractedData ?? {});
    }
  }, [doc]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await reviewMutation.mutateAsync({ id: documentId, payload: { correctedData: fields } });
      toast.success("Review submitted");
      onClose();
    } catch {
      toast.error("Failed to submit review");
    }
  }

  if (!doc) return null;

  const entries = Object.entries(fields);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Review Extracted Data</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {doc.confidence !== undefined && doc.confidence < 0.6 && (
          <div className="mx-6 mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">
              Low confidence ({Math.round((doc.confidence ?? 0) * 100)}%). Please verify all fields carefully.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500">No extracted fields available.</p>
          ) : (
            entries.map(([key, val]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5C47] outline-none"
                />
              </div>
            ))
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50 text-sm font-medium"
            >
              {reviewMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Document card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  onReview,
  onProcess,
  onCreatePrescription,
}: {
  doc: OcrDocument;
  onReview: (id: string) => void;
  onProcess: (id: string) => void;
  onCreatePrescription?: (ocrData: ReturnType<typeof mapOcrToPrescription>) => void;
}) {
  const trigger = useTriggerOcrMutation();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {doc.originalFileName ?? doc.id.slice(0, 12)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {doc.documentType} · {new Date(doc.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      {doc.confidence !== undefined && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <ConfidenceBar value={doc.confidence} />
          {doc.confidence < 0.6 && (
            <p className="text-xs text-red-500 mt-1">
              ⚠ Low confidence — review required
            </p>
          )}
        </div>
      )}

      {doc.status === "FAILED" && doc.errorMessage && (
        <p className="text-xs text-red-600 bg-red-50 rounded p-2">{doc.errorMessage}</p>
      )}

      {doc.status === "COMPLETED" && doc.extractedData && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          {Object.entries(doc.correctedData ?? doc.extractedData)
            .slice(0, 4)
            .map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{k.replace(/_/g, " ")}</span>
                <span className="text-gray-900 font-medium truncate max-w-[120px]">{v}</span>
              </div>
            ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {doc.status === "PENDING" && (
          <button
            onClick={() => onProcess(doc.id)}
            disabled={trigger.isPending}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {trigger.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : null}
            Process
          </button>
        )}
        {doc.status === "COMPLETED" && (
          <button
            onClick={() => onReview(doc.id)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="w-3 h-3" />
            Review
          </button>
        )}
        {doc.status === "COMPLETED" && doc.documentType === "PRESCRIPTION" && onCreatePrescription && (
          <button
            onClick={() =>
              onCreatePrescription(
                mapOcrToPrescription(
                  doc.correctedData ?? doc.extractedData ?? {},
                  doc.id,
                ),
              )
            }
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0F5C47] text-white text-xs rounded-lg hover:bg-[#0d4a39]"
          >
            <ClipboardList className="w-3 h-3" />
            Create Prescription
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function OcrPage() {
  const { currentBranch } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState<OcrDocumentType>("INVOICE");
  const [reviewDocId, setReviewDocId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleCreatePrescription(ocrData: ReturnType<typeof mapOcrToPrescription>) {
    navigate("/app/prescriptions", { state: { ocrData } });
  }

  const { data: documents = [], isLoading } = useOcrDocumentsQuery({
    branchId: currentBranch?.id,
  });
  const upload = useUploadOcrDocumentMutation();
  const trigger = useTriggerOcrMutation();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Unsupported file type. Use JPEG, PNG, WebP, or PDF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File exceeds the 10 MB size limit.");
      return;
    }
    if (!currentBranch?.id) {
      setFileError("No branch selected — please select a branch first.");
      return;
    }

    upload.mutate(
      { file, documentType, branchId: currentBranch.id },
      {
        onSuccess: () => { toast.success("Document uploaded"); setFileError(null); },
        onError: () => setFileError("Upload failed. Please try again."),
      },
    );

    // reset input
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">OCR Import</h1>
        <p className="text-sm text-gray-600 mt-1">
          Upload invoices or prescriptions for automatic data extraction
        </p>
      </div>

      {/* Upload card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Upload Document</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as OcrDocumentType)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
            >
              <option value="INVOICE">Invoice</option>
              <option value="PRESCRIPTION">Prescription</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File (JPEG, PNG, WebP, PDF · max 10 MB)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#0F5C47] transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {upload.isPending ? (
                <Loader2 className="w-8 h-8 text-[#0F5C47] animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to select file</p>
                  <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
            {fileError && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {fileError}
              </p>
            )}
            {!currentBranch?.id && !fileError && (
              <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                No branch selected — uploads will be blocked until a branch is active.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Documents {!isLoading && `(${documents.length})`}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading…
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={ScanLine}
            heading="No documents uploaded"
            subline="Upload an invoice or prescription image to extract data automatically"
            action={{ label: "Upload Document", onClick: () => fileRef.current?.click() }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onReview={setReviewDocId}
                onProcess={(id) =>
                  trigger.mutate(id, {
                    onError: () => toast.error("Failed to start processing"),
                  })
                }
                onCreatePrescription={handleCreatePrescription}
              />
            ))}
          </div>
        )}
      </div>

      {reviewDocId && (
        <ReviewModal documentId={reviewDocId} onClose={() => setReviewDocId(null)} />
      )}
    </div>
  );
}
