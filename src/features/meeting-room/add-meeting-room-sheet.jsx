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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

import { useCreateMeetingRoom } from "./queries";

export default function AddMeetingRoomSheet({ open, onOpenChange }) {
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hasVideoConf, setHasVideoConf] = useState(false);

  const createMutation = useCreateMeetingRoom();

  const resetForm = () => {
    setRoomName(""); setLocation(""); setCapacity(""); setHasVideoConf(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error("Room name is required.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        roomName: roomName.trim(),
        location: location.trim() || null,
        capacity: capacity ? Number(capacity) : null,
        hasVideoConf: hasVideoConf ? "Y" : "N",
      });
      toast.success("Meeting room created successfully!");
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create meeting room. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Add meeting room</SheetTitle>
          <SheetDescription>Create a new bookable room.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="roomName">Room name</Label>
            <Input
              id="roomName" value={roomName} onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Boardroom A" required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="location" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 3rd floor, west wing"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="capacity" type="number" min="0" value={capacity}
              onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 12"
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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save room"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}