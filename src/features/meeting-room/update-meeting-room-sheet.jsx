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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Edit meeting room</SheetTitle>
          <SheetDescription>Update this room's details.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="roomName">Room name</Label>
            <Input id="roomName" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="capacity" type="number" min="0" value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="hasVideoConf" checked={hasVideoConf}
              onCheckedChange={(checked) => setHasVideoConf(!!checked)}
            />
            <Label htmlFor="hasVideoConf" className="font-normal">Has video conferencing</Label>
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