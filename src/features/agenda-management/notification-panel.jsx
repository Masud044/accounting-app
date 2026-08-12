import { useState } from "react";
import { toast } from "react-toastify";
import { Send, Trash2, Bell, AlertCircle, RefreshCw, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import { useNotifications, useCreateNotification, useDeleteNotification } from "./queries";

export default function NotificationsPanel({ meetingId, participants }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [notificationType, setNotificationType] = useState("REMINDER");
  const [message, setMessage] = useState("");

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: notifications = [], isLoading, isError, error, refetch, isFetching } = useNotifications(meetingId);
  const createMutation = useCreateNotification(meetingId);
  const deleteMutation = useDeleteNotification(meetingId);

  const toggleParticipant = (employeeId) => {
    setSelectedIds((ids) =>
      ids.includes(employeeId) ? ids.filter((i) => i !== employeeId) : [...ids, employeeId]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one recipient.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        employeeIds: selectedIds,
        notificationType,
        message: message.trim() || null,
      });
      toast.success("Notification queued successfully!");
      setSelectedIds([]);
      setMessage("");
    } catch (err) {
      toast.error(err?.message || "Failed to send notification. Please try again.");
    }
  };

  const handleDelete = async (notification) => {
    const confirmed = await showConfirmation({
      title: "Delete notification?",
      description: `Cancel the ${notification.NOTIFICATION_TYPE?.toLowerCase()} notification for ${notification.EMPLOYEE_NAME}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(notification.NOTIFICATION_ID);
        toast.success("Notification deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete notification. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="h-10 w-10 mb-4" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Notifications</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load notifications."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-md shadow-sm p-4 space-y-3">
        <p className="text-sm font-medium">Send a notification</p>

        <div className="flex flex-wrap gap-3">
          {participants.map((p) => (
            <label key={p.EMPLOYEE_ID} className="flex items-center gap-2 text-sm border rounded-md px-2 py-1.5 cursor-pointer">
              <Checkbox
                checked={selectedIds.includes(p.EMPLOYEE_ID)}
                onCheckedChange={() => toggleParticipant(p.EMPLOYEE_ID)}
              />
              {p.EMPLOYEE_NAME}
            </label>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={notificationType} onValueChange={setNotificationType}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent className="z-[110]">
              <SelectItem value="REMINDER">Reminder</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="CANCELLATION">Cancellation</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message..." className="flex-1"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={createMutation.isPending}>
            {createMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Sending...</> : <><Send className="mr-1 h-4 w-4" />Queue notification</>}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md shadow-sm p-4">
        {notifications.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Bell /></EmptyMedia>
              <EmptyTitle>No Notifications Yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="divide-y rounded-md border">
            {notifications.map((n) => (
              <div key={n.NOTIFICATION_ID} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.EMPLOYEE_NAME}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.MESSAGE || "—"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="capitalize">{n.NOTIFICATION_TYPE?.toLowerCase()}</Badge>
                  {n.IS_SENT === "Y" ? (
                    <Badge variant="default"><Check className="h-3 w-3 mr-1" />Sent</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(n)} disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationDialog />
    </div>
  );
}