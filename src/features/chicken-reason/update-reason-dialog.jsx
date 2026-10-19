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

import { useUpdateMortalityReason } from "./queries";

const schema = z.object({
  reasonName: z
    .string()
    .trim()
    .min(1, "Reason name is required")
    .max(100, "Maximum 100 characters"),
});

export default function UpdateReasonDialog({ open, onOpenChange, record }) {
  const updateMutation = useUpdateMortalityReason();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { reasonName: record?.REASON_NAME ?? "" },
  });

  const onSubmit = async (values) => {
    try {
      await updateMutation.mutateAsync({ id: record.ID, data: values });
      toast.success("Reason updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update reason. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !updateMutation.isPending && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update reason</DialogTitle>
          <DialogDescription>Change the name of this mortality reason.</DialogDescription>
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
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}