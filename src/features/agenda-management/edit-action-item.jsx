import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateActionItem } from "./queries";

export default function EditActionItemSheet({ open, onOpenChange, meetingId, item, agendaItems, participants }) {
  const [description, setDescription] = useState("");
  const [agendaItemId, setAgendaItemId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("OPEN");
  const [dueDate, setDueDate] = useState("");

  const updateMutation = useUpdateActionItem(meetingId);

  // Prefill whenever a different item is opened for editing
  useEffect(() => {
    if (!item) return;
    setDescription(item.DESCRIPTION || "");
    setAgendaItemId(item.AGENDA_ITEM_ID ? String(item.AGENDA_ITEM_ID) : "");
    setAssignedTo(item.ASSIGNED_TO ? String(item.ASSIGNED_TO) : "");
    setPriority(item.PRIORITY || "MEDIUM");
    setStatus(item.STATUS || "OPEN");
    setDueDate(item.DUE_DATE ? item.DUE_DATE.slice(0, 10) : "");
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !assignedTo) {
      toast.error("Description and assignee are required.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        actionItemId: item.ACTION_ITEM_ID,
        data: {
          agendaItemId: agendaItemId ? Number(agendaItemId) : null,
          description: description.trim(),
          assignedTo: Number(assignedTo),
          priority,
          status,
          dueDate: dueDate || null,
        },
      });
      toast.success("Action item updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update action item. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Edit action item</SheetTitle>
          <SheetDescription>Update the details of this follow-up task.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?" required
            />
          </div>

          <div className="grid gap-2">
            <Label>Related agenda item <span className="text-muted-foreground">(optional)</span></Label>
            <Select value={agendaItemId} onValueChange={setAgendaItemId}>
              <SelectTrigger><SelectValue placeholder="Select agenda item" /></SelectTrigger>
              <SelectContent className="z-[110]">
                {agendaItems.map((a) => (
                  <SelectItem key={a.AGENDA_ITEM_ID} value={String(a.AGENDA_ITEM_ID)}>
                    {a.TOPIC}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Assign to</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
              <SelectContent className="z-[110]">
                {participants.map((p) => (
                  <SelectItem key={p.EMPLOYEE_ID} value={String(p.EMPLOYEE_ID)}>
                    {p.EMPLOYEE_NAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-[110]">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due date <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="edit-dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="z-[110]">
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}