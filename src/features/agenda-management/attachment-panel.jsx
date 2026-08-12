import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Upload, Download, Trash2, FileText, AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import {
  useAttachments,
  useUploadAttachment,
  useDeleteAttachment,
  attachmentDownloadUrl,
  useEmployees,
} from "./queries";

export default function AttachmentsPanel({ meetingId, agendaItems }) {
  const fileInputRef = useRef(null);
  const [agendaItemId, setAgendaItemId] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: attachments = [], isLoading, isError, error, refetch, isFetching } = useAttachments(meetingId);
  const { data: employees = [] } = useEmployees();
  const uploadMutation = useUploadAttachment(meetingId);
  const deleteMutation = useDeleteAttachment(meetingId);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploadedBy) {
      toast.error("Select who is uploading before choosing a file.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (agendaItemId) formData.append("agendaItemId", agendaItemId);
    formData.append("uploadedBy", uploadedBy);

    try {
      await uploadMutation.mutateAsync(formData);
      toast.success("File uploaded successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to upload file. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const handleDelete = async (attachment) => {
    const confirmed = await showConfirmation({
      title: "Delete attachment?",
      description: `Are you sure you want to delete "${attachment.FILE_NAME}"? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(attachment.ATTACHMENT_ID);
        toast.success("Attachment deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete attachment. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="h-10 w-10 mb-4" />
          <p className="text-muted-foreground">Loading attachments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Attachments</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load attachments."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <Select value={uploadedBy} onValueChange={setUploadedBy}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Uploaded by" /></SelectTrigger>
          <SelectContent className="z-[110]">
            {employees.map((emp) => (
              <SelectItem key={emp.EMPLOYEE_ID} value={String(emp.EMPLOYEE_ID)}>
                {emp.FIRST_NAME} {emp.LAST_NAME}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={agendaItemId} onValueChange={setAgendaItemId}>
          <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Attach to agenda item (optional)" /></SelectTrigger>
          <SelectContent className="z-[110]">
            {agendaItems.map((a) => (
              <SelectItem key={a.AGENDA_ITEM_ID} value={String(a.AGENDA_ITEM_ID)}>
                {a.TOPIC}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Uploading...</> : <><Upload className="mr-1 h-4 w-4" />Upload file</>}
        </Button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      </div>

      {attachments.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><FileText /></EmptyMedia>
            <EmptyTitle>No Attachments Yet</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="divide-y rounded-md border">
          {attachments.map((att) => (
            <div key={att.ATTACHMENT_ID} className="flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{att.FILE_NAME}</p>
                  <p className="text-xs text-muted-foreground">
                    {att.AGENDA_TOPIC ? `${att.AGENDA_TOPIC} · ` : ""}
                    {att.UPLOADED_BY_NAME || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={attachmentDownloadUrl(meetingId, att.ATTACHMENT_ID)} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </a>
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(att)} disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmationDialog />
    </div>
  );
}