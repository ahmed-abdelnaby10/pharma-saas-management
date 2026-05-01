import { useState } from "react";
import { useRtl } from "@/shared/hooks/useRtl";
import {
  Plus,
  Search,
  Loader2,
  X,
  ChevronRight,
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  LifeBuoy,
} from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { toast } from "sonner";
import {
  useMyTicketsQuery,
  useMyTicketQuery,
  useCreateTicketMutation,
} from "@/features/client/support/api/support.hooks";
import type {
  TenantSupportTicket,
  TenantTicketStatus,
  TenantTicketPriority,
  TenantTicketCategory,
} from "@/features/client/support/api/support.types";

// ─── Badges ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TenantTicketStatus, { cls: string; icon: React.ElementType }> = {
  OPEN:        { cls: "bg-blue-50 text-blue-700 border-blue-200",    icon: HelpCircle   },
  IN_PROGRESS: { cls: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock     },
  RESOLVED:    { cls: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle  },
  CLOSED:      { cls: "bg-gray-100 text-gray-500 border-gray-200",   icon: XCircle      },
};

const PRIORITY_STYLES: Record<TenantTicketPriority, string> = {
  low:      "text-gray-500",
  medium:   "text-blue-500",
  high:     "text-orange-500",
  critical: "text-red-600 font-semibold",
};

function StatusBadge({ status }: { status: TenantTicketStatus }) {
  const { cls, icon: Icon } = STATUS_STYLES[status] ?? STATUS_STYLES.OPEN;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      <Icon className="w-3 h-3" />
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityDot({ priority }: { priority?: TenantTicketPriority }) {
  if (!priority) return null;
  return (
    <span className={`text-xs capitalize ${PRIORITY_STYLES[priority]}`}>{priority}</span>
  );
}

// ─── Ticket Detail Panel ──────────────────────────────────────────────────────

function TicketDetailPanel({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const { data: ticket, isLoading } = useMyTicketQuery(ticketId);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Ticket Detail</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading…
          </div>
        ) : ticket ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900 leading-tight">{ticket.subject}</h4>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                {ticket.priority && (
                  <>
                    <span>·</span>
                    <PriorityDot priority={ticket.priority} />
                  </>
                )}
                {ticket.category && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{ticket.category.replace("_", " ")}</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>

            {ticket.resolutionNote && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Resolution Note</p>
                </div>
                <p className="text-sm text-green-800 whitespace-pre-wrap">{ticket.resolutionNote}</p>
              </div>
            )}

            {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS") && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Your ticket is being reviewed by our support team. We'll update you shortly.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="p-6 text-sm text-gray-400">Ticket not found.</p>
        )}
      </div>
    </div>
  );
}

// ─── New Ticket Form ──────────────────────────────────────────────────────────

interface NewTicketForm {
  subject: string;
  description: string;
  category: TenantTicketCategory | "";
  priority: TenantTicketPriority | "";
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const createTicket = useCreateTicketMutation();
  const [form, setForm] = useState<NewTicketForm>({
    subject: "",
    description: "",
    category: "",
    priority: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasErrors = Object.keys(errors).length > 0;

  function field(key: keyof NewTicketForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    };
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    const subject = form.subject.trim();
    if (!subject) e.subject = "Subject is required";
    else if (subject.length < 5) e.subject = "Subject must be at least 5 characters";
    else if (subject.length > 200) e.subject = "Subject must be 200 characters or less";
    const desc = form.description.trim();
    if (!desc) e.description = "Description is required";
    else if (desc.length < 10) e.description = "Description must be at least 10 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await createTicket.mutateAsync({
        subject:     form.subject.trim(),
        description: form.description.trim(),
        ...(form.category ? { category: form.category as TenantTicketCategory } : {}),
        ...(form.priority ? { priority: form.priority as TenantTicketPriority } : {}),
      });
      toast.success("Support ticket submitted");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to create ticket");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Support Ticket</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              value={form.subject}
              onChange={field("subject")}
              placeholder="Brief summary of your issue"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm ${errors.subject ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={field("description")}
              rows={4}
              placeholder="Describe your issue in detail…"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={field("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              >
                <option value="">Select…</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="feature_request">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={field("priority")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              >
                <option value="">Select…</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createTicket.isPending || hasErrors}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm font-medium"
            >
              {createTicket.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Ticket
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SupportPage() {
  const [search, setSearch]                     = useState("");
  const [statusFilter, setStatusFilter]         = useState<TenantTicketStatus | "all">("all");
  const [isNewOpen, setIsNewOpen]               = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { dirFlip } = useRtl();

  const { data: tickets = [], isLoading } = useMyTicketsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Support</h1>
          <p className="mt-1 text-sm text-gray-500">Submit and track your support requests</p>
        </div>
        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TenantTicketStatus | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
        >
          <option value="all">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Ticket list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading tickets…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LifeBuoy}
            heading={tickets.length === 0 ? "No tickets yet" : "No tickets match"}
            subline={
              tickets.length === 0
                ? "Submit a support request and our team will get back to you"
                : "Try clearing the search or status filter"
            }
            action={
              tickets.length === 0
                ? { label: "New Ticket", onClick: () => setIsNewOpen(true) }
                : undefined
            }
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((ticket: TenantSupportTicket) => (
              <li key={ticket.id}>
                <button
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {ticket.priority && (
                        <>
                          <span>·</span>
                          <PriorityDot priority={ticket.priority} />
                        </>
                      )}
                      {ticket.category && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{ticket.category.replace("_", " ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 ${dirFlip}`} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          {filtered.length} of {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isNewOpen && <NewTicketModal onClose={() => setIsNewOpen(false)} />}
      {selectedTicketId && (
        <TicketDetailPanel
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
}
