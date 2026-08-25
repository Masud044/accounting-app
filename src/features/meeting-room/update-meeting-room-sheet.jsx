// import { useEffect, useState } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Spinner } from "@/components/ui/spinner";

// import { useUpdateMeetingRoom } from "./queries";

// export default function UpdateMeetingRoomSheet({ open, onOpenChange, record }) {
//   const [roomName, setRoomName] = useState("");
//   const [location, setLocation] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [hasVideoConf, setHasVideoConf] = useState(false);

//   const updateMutation = useUpdateMeetingRoom();

//   useEffect(() => {
//     if (record) {
//       setRoomName(record.ROOM_NAME || "");
//       setLocation(record.LOCATION || "");
//       setCapacity(record.CAPACITY != null ? String(record.CAPACITY) : "");
//       setHasVideoConf(record.HAS_VIDEO_CONF === "Y");
//     }
//   }, [record]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!roomName.trim()) {
//       toast.error("Room name is required.");
//       return;
//     }
//     try {
//       await updateMutation.mutateAsync({
//         id: record.ROOM_ID,
//         data: {
//           roomName: roomName.trim(),
//           location: location.trim() || null,
//           capacity: capacity ? Number(capacity) : null,
//           hasVideoConf: hasVideoConf ? "Y" : "N",
//         },
//       });
//       toast.success("Meeting room updated successfully!");
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to update meeting room. Please try again.");
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
//         <SheetHeader>
//           <SheetTitle>Edit meeting room</SheetTitle>
//           <SheetDescription>Update this room's details.</SheetDescription>
//         </SheetHeader>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
//           <div className="grid gap-2">
//             <Label htmlFor="roomName">Room name</Label>
//             <Input id="roomName" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="location">Location <span className="text-muted-foreground">(optional)</span></Label>
//             <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="capacity">Capacity <span className="text-muted-foreground">(optional)</span></Label>
//             <Input
//               id="capacity" type="number" min="0" value={capacity}
//               onChange={(e) => setCapacity(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Checkbox
//               id="hasVideoConf" checked={hasVideoConf}
//               onCheckedChange={(checked) => setHasVideoConf(!!checked)}
//             />
//             <Label htmlFor="hasVideoConf" className="font-normal">Has video conferencing</Label>
//           </div>

//           <SheetFooter className="px-0">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={updateMutation.isPending}>
//               {updateMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save changes"}
//             </Button>
//           </SheetFooter>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { DoorOpen, X, Video } from "lucide-react";

import { useUpdateMeetingRoom } from "./queries";

export default function UpdateMeetingRoomSheet({ open, onOpenChange, record }) {
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hasVideoConf, setHasVideoConf] = useState(false);

  const updateMutation = useUpdateMeetingRoom();

  useEffect(() => {
    if (record) {
      setRoomName(record.ROOM_NAME || "");
      setLocation(record.LOCATION || "");
      setCapacity(record.CAPACITY != null ? String(record.CAPACITY) : "");
      setHasVideoConf(record.HAS_VIDEO_CONF === "Y");
    }
  }, [record]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error("Room name is required.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: record.ROOM_ID,
        data: {
          roomName: roomName.trim(),
          location: location.trim() || null,
          capacity: capacity ? Number(capacity) : null,
          hasVideoConf: hasVideoConf ? "Y" : "N",
        },
      });
      toast.success("Meeting room updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update meeting room. Please try again.");
    }
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg w-full p-0 gap-0 overflow-hidden border-border/60 shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="relative px-6 py-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/20 shadow-sm">
              <DoorOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Edit Meeting Room
              </DialogTitle>
              <DialogDescription>Update this room's details</DialogDescription>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="absolute top-5 right-5 rounded-lg p-1.5 text-muted-foreground/70 hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 sm:col-span-2">
                <Label
                  htmlFor="roomName"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Room Name
                </Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                  className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background"
                  required
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Location <span className="normal-case text-muted-foreground/70">(optional)</span>
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="capacity"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Capacity <span className="normal-case text-muted-foreground/70">(optional)</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background"
                />
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-muted/50 px-4 py-3 sm:mt-6">
                <Checkbox
                  id="hasVideoConf"
                  checked={hasVideoConf}
                  onCheckedChange={(checked) => setHasVideoConf(!!checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="hasVideoConf" className="flex items-center gap-1.5 font-normal cursor-pointer">
                  <Video className="h-3.5 w-3.5 text-muted-foreground" />
                  Video conferencing
                </Label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-sm">
              {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}