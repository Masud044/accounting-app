// import { useState } from "react";
// import { toast } from "react-toastify";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetFooter,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useCreateActionItem } from "./queries";

// export default function AddActionItemSheet({ open, onOpenChange, meetingId, agendaItems, participants }) {
//   const [description, setDescription] = useState("");
//   const [agendaItemId, setAgendaItemId] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [priority, setPriority] = useState("MEDIUM");
//   const [dueDate, setDueDate] = useState("");

//   const createMutation = useCreateActionItem(meetingId);

//   const resetForm = () => {
//     setDescription(""); setAgendaItemId(""); setAssignedTo("");
//     setPriority("MEDIUM"); setDueDate("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!description.trim() || !assignedTo) {
//       toast.error("Description and assignee are required.");
//       return;
//     }
//     try {
//       await createMutation.mutateAsync({
//         agendaItemId: agendaItemId ? Number(agendaItemId) : null,
//         description: description.trim(),
//         assignedTo: Number(assignedTo),
//         priority,
//         dueDate: dueDate || null,
//       });
//       toast.success("Action item created successfully!");
//       resetForm();
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to create action item. Please try again.");
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
//         <SheetHeader>
//           <SheetTitle>Add action item</SheetTitle>
//           <SheetDescription>Create a follow-up task for this meeting.</SheetDescription>
//         </SheetHeader>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
//           <div className="grid gap-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description" value={description} onChange={(e) => setDescription(e.target.value)}
//               placeholder="What needs to be done?" required
//             />
//           </div>

//           <div className="grid gap-2">
//             <Label>Related agenda item <span className="text-muted-foreground">(optional)</span></Label>
//             <Select value={agendaItemId} onValueChange={setAgendaItemId}>
//               <SelectTrigger><SelectValue placeholder="Select agenda item" /></SelectTrigger>
//               <SelectContent className="z-[110]">
//                 {agendaItems.map((a) => (
//                   <SelectItem key={a.AGENDA_ITEM_ID} value={String(a.AGENDA_ITEM_ID)}>
//                     {a.TOPIC}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid gap-2">
//             <Label>Assign to</Label>
//             <Select value={assignedTo} onValueChange={setAssignedTo}>
//               <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
//               <SelectContent className="z-[110]">
//                 {participants.map((p) => (
//                   <SelectItem key={p.EMPLOYEE_ID} value={String(p.EMPLOYEE_ID)}>
//                     {p.EMPLOYEE_NAME}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="grid gap-2">
//               <Label>Priority</Label>
//               <Select value={priority} onValueChange={setPriority}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent className="z-[110]">
//                   <SelectItem value="LOW">Low</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="HIGH">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="dueDate">Due date <span className="text-muted-foreground">(optional)</span></Label>
//               <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
//             </div>
//           </div>

//           <SheetFooter className="px-0">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={createMutation.isPending}>
//               {createMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Add action item"}
//             </Button>
//           </SheetFooter>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }
import { useState } from "react";
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

import { useCreateActionItem } from "./queries";

export default function AddActionItemSheet({ open, onOpenChange, meetingId, agendaItems, participants }) {
  const [description, setDescription] = useState("");
  const [agendaItemId, setAgendaItemId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const createMutation = useCreateActionItem(meetingId);

  const resetForm = () => {
    setDescription(""); setAgendaItemId(""); setAssignedTo(""); setAssignedBy("");
    setPriority("MEDIUM"); setDueDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !assignedTo || !assignedBy) {
      toast.error("Description, assignee, and assigned-by are required.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        agendaItemId: agendaItemId ? Number(agendaItemId) : null,
        description: description.trim(),
        assignedTo: Number(assignedTo),
        assignedBy: Number(assignedBy),
        priority,
        dueDate: dueDate || null,
      });
      toast.success("Action item created successfully!");
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create action item. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Add action item</SheetTitle>
          <SheetDescription>Create a follow-up task for this meeting.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)}
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

          <div className="grid grid-cols-2 gap-3">
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
            <div className="grid gap-2">
              <Label>Assigned by</Label>
              <Select value={assignedBy} onValueChange={setAssignedBy}>
                <SelectTrigger><SelectValue placeholder="Select assigner" /></SelectTrigger>
                <SelectContent className="z-[110]">
                  {participants.map((p) => (
                    <SelectItem key={p.EMPLOYEE_ID} value={String(p.EMPLOYEE_ID)}>
                      {p.EMPLOYEE_NAME}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="dueDate">Due date <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <SheetFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Add action item"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}