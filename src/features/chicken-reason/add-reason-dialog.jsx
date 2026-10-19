import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

import { useCreateMortalityReason } from "./queries";

const schema = z.object({
  reasonName: z
    .string()
    .trim()
    .min(1, "Reason name is required")
    .max(100, "Maximum 100 characters"),
});

export default function AddReasonDialog({ open, onOpenChange }) {
  const createMutation = useCreateMortalityReason();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { reasonName: "" },
  });

  const onSubmit = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Reason added successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add reason. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !createMutation.isPending && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add reason</DialogTitle>
          <DialogDescription>
            Add a reason that can be picked when recording mortality.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reasonName">Reason name</Label>
            <Input id="reasonName" autoFocus {...register("reasonName")} />
            {errors.reasonName && (
              <p className="text-xs text-red-600">{errors.reasonName.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
              Add reason
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}