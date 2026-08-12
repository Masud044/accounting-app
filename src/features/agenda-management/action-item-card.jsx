// import { useState } from "react";
// import { toast } from "react-toastify";
// import { Plus, Trash2, AlertCircle, RefreshCw } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Spinner } from "@/components/ui/spinner";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

// import { useActionItems, useUpdateActionItemStatus, useDeleteActionItem } from "./queries";
// import AddActionItemSheet from "./add-action-item";

// const COLUMNS = [
//   { status: "OPEN",        label: "Open" },
//   { status: "IN_PROGRESS", label: "In progress" },
//   { status: "DONE",        label: "Done" },
// ];

// const PRIORITY_VARIANT = {
//   LOW:    "secondary",
//   MEDIUM: "default",
//   HIGH:   "destructive",
// };

// function ActionItemCard({ item, onMove, onDelete }) {
//   const nextStatus = {
//     OPEN: "IN_PROGRESS",
//     IN_PROGRESS: "DONE",
//     DONE: null,
//   }[item.STATUS];

//   const prevStatus = {
//     OPEN: null,
//     IN_PROGRESS: "OPEN",
//     DONE: "IN_PROGRESS",
//   }[item.STATUS];

//   return (
//     <div className="rounded-md border bg-background p-3 space-y-2">
//       <div className="flex items-start justify-between gap-2">
//         <p className="text-sm font-medium leading-snug">{item.DESCRIPTION}</p>
//         <Button
//           variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
//           onClick={() => onDelete(item)}
//         >
//           <Trash2 className="h-3.5 w-3.5" />
//           <span className="sr-only">Delete</span>
//         </Button>
//       </div>
//       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//         <span>{item.ASSIGNED_TO_NAME || "Unassigned"}</span>
//         {item.PRIORITY && (
//           <Badge variant={PRIORITY_VARIANT[item.PRIORITY] || "default"} className="text-[10px] px-1.5 py-0 capitalize">
//             {item.PRIORITY.toLowerCase()}
//           </Badge>
//         )}
//       </div>
//       <div className="flex items-center gap-2 pt-1">
//         {prevStatus && (
//           <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onMove(item, prevStatus)}>
//             ← Move back
//           </Button>
//         )}
//         {nextStatus && (
//           <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onMove(item, nextStatus)}>
//             Move to {COLUMNS.find((c) => c.status === nextStatus)?.label} →
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function ActionItemsBoard({ meetingId, agendaItems, participants }) {
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const { data: items = [], isLoading, isError, error, refetch, isFetching } = useActionItems(meetingId);
//   const updateStatusMutation = useUpdateActionItemStatus(meetingId);
//   const deleteMutation = useDeleteActionItem(meetingId);

//   const handleMove = async (item, status) => {
//     try {
//       await updateStatusMutation.mutateAsync({ actionItemId: item.ACTION_ITEM_ID, status });
//     } catch (err) {
//       toast.error(err?.message || "Failed to update status. Please try again.");
//     }
//   };

//   const handleDelete = async (item) => {
//     const confirmed = await showConfirmation({
//       title: "Delete action item?",
//       description: `Are you sure you want to delete "${item.DESCRIPTION}"?`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });
//     if (confirmed) {
//       try {
//         await deleteMutation.mutateAsync(item.ACTION_ITEM_ID);
//         toast.success("Action item deleted successfully!");
//       } catch (err) {
//         toast.error(err?.message || "Failed to delete action item. Please try again.");
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="flex flex-col items-center justify-center py-16">
//           <Spinner className="h-10 w-10 mb-4" />
//           <p className="text-muted-foreground">Loading action items...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Action Items</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load action items."}</p>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <Button onClick={() => setIsAddOpen(true)}>
//           <Plus className="mr-1 h-4 w-4" />Add action item
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {COLUMNS.map((col) => {
//           const colItems = items.filter((item) => (item.STATUS || "OPEN") === col.status);
//           return (
//             <div key={col.status} className="bg-card rounded-md shadow-sm p-3">
//               <div className="flex items-center justify-between mb-3 px-1">
//                 <h3 className="text-sm font-medium text-muted-foreground">{col.label}</h3>
//                 <span className="text-xs text-muted-foreground">{colItems.length}</span>
//               </div>
//               <div className="space-y-2 min-h-[80px]">
//                 {colItems.length === 0 ? (
//                   <p className="text-xs text-muted-foreground px-1 py-4 text-center">No items</p>
//                 ) : (
//                   colItems.map((item) => (
//                     <ActionItemCard key={item.ACTION_ITEM_ID} item={item} onMove={handleMove} onDelete={handleDelete} />
//                   ))
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {isAddOpen && (
//         <AddActionItemSheet
//           open={isAddOpen}
//           onOpenChange={setIsAddOpen}
//           meetingId={meetingId}
//           agendaItems={agendaItems}
//           participants={participants}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, AlertCircle, RefreshCw, Pencil, Ban, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import { useActionItems, useUpdateActionItemStatus, useDeleteActionItem } from "./queries";
import AddActionItemSheet from "./add-action-item";
import EditActionItemSheet from "./edit-action-item";

// Forward/backward chain — Cancel is a separate branch, not part of this chain.
const NEXT_STATUS = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
};
const PREV_STATUS = {
  OPEN: null,
  IN_PROGRESS: "OPEN",
  COMPLETED: "IN_PROGRESS",
  CANCELLED: null,
};

const COLUMNS = [
  { status: "OPEN",        label: "Open" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED",   label: "Completed" },
  { status: "CANCELLED",   label: "Cancelled" },
];

const PRIORITY_VARIANT = {
  LOW:    "secondary",
  MEDIUM: "default",
  HIGH:   "destructive",
};

function ActionItemCard({ item, onMove, onCancel, onReopen, onDelete, onEdit }) {
  const nextStatus = NEXT_STATUS[item.STATUS];
  const prevStatus = PREV_STATUS[item.STATUS];
  const canCancel = item.STATUS === "OPEN" || item.STATUS === "IN_PROGRESS";
  const isCancelled = item.STATUS === "CANCELLED";

  return (
    <div className={`rounded-md border bg-background p-3 space-y-2 ${isCancelled ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="text-sm font-medium leading-snug text-left hover:underline"
        >
          {item.DESCRIPTION}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"
            onClick={() => onEdit(item)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{item.ASSIGNED_TO_NAME || "Unassigned"}</span>
        {item.PRIORITY && (
          <Badge variant={PRIORITY_VARIANT[item.PRIORITY] || "default"} className="text-[10px] px-1.5 py-0 capitalize">
            {item.PRIORITY.toLowerCase()}
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {prevStatus && (
          <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onMove(item, prevStatus)}>
            ← Move back
          </Button>
        )}
        {nextStatus && (
          <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onMove(item, nextStatus)}>
            Move to {COLUMNS.find((c) => c.status === nextStatus)?.label} →
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outline" size="sm"
            className="h-6 text-xs px-2 text-destructive hover:text-destructive"
            onClick={() => onCancel(item)}
          >
            <Ban className="h-3 w-3 mr-1" />Cancel
          </Button>
        )}
        {isCancelled && (
          <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onReopen(item)}>
            <RotateCcw className="h-3 w-3 mr-1" />Reopen
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ActionItemsBoard({ meetingId, agendaItems, participants }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: items = [], isLoading, isError, error, refetch, isFetching } = useActionItems(meetingId);
  const updateStatusMutation = useUpdateActionItemStatus(meetingId);
  const deleteMutation = useDeleteActionItem(meetingId);

  const handleMove = async (item, status) => {
    try {
      await updateStatusMutation.mutateAsync({ actionItemId: item.ACTION_ITEM_ID, status });
    } catch (err) {
      toast.error(err?.message || "Failed to update status. Please try again.");
    }
  };

  const handleCancel = async (item) => {
    const confirmed = await showConfirmation({
      title: "Cancel action item?",
      description: `"${item.DESCRIPTION}" will be marked as cancelled.`,
      confirmText: "Cancel item",
      cancelText: "Keep it",
      variant: "destructive",
    });
    if (confirmed) handleMove(item, "CANCELLED");
  };

  const handleReopen = async (item) => {
    handleMove(item, "OPEN");
  };

  const handleDelete = async (item) => {
    const confirmed = await showConfirmation({
      title: "Delete action item?",
      description: `Are you sure you want to delete "${item.DESCRIPTION}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(item.ACTION_ITEM_ID);
        toast.success("Action item deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete action item. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="h-10 w-10 mb-4" />
          <p className="text-muted-foreground">Loading action items...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Action Items</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load action items."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />Add action item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colItems = items.filter((item) => (item.STATUS || "OPEN") === col.status);
          return (
            <div key={col.status} className="bg-card rounded-md shadow-sm p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-muted-foreground">{col.label}</h3>
                <span className="text-xs text-muted-foreground">{colItems.length}</span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {colItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-1 py-4 text-center">No items</p>
                ) : (
                  colItems.map((item) => (
                    <ActionItemCard
                      key={item.ACTION_ITEM_ID}
                      item={item}
                      onMove={handleMove}
                      onCancel={handleCancel}
                      onReopen={handleReopen}
                      onDelete={handleDelete}
                      onEdit={setEditingItem}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAddOpen && (
        <AddActionItemSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          meetingId={meetingId}
          agendaItems={agendaItems}
          participants={participants}
        />
      )}

      {editingItem && (
        <EditActionItemSheet
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          meetingId={meetingId}
          item={editingItem}
          agendaItems={agendaItems}
          participants={participants}
        />
      )}

      <ConfirmationDialog />
    </div>
  );
}