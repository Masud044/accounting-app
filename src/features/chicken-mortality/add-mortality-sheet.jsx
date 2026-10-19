import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

import { useMortalityReasons } from "../chicken-reason/queries";
import { useCreateMortality } from "./queries";

const schema = z.object({
  mortalityDate: z.string().min(1, "Date is required"),
  qty: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  reasonId: z.string().min(1, "Select a reason"),
  remarks: z.string().max(500, "Maximum 500 characters").optional(),
});

const today = () => new Date().toISOString().slice(0, 10);

export default function AddMortalitySheet({ open, onOpenChange, showConfirmation, detailId }) {
  const createMutation = useCreateMortality(detailId);
  const { data: reasons = [], isLoading: reasonsLoading } = useMortalityReasons();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { mortalityDate: today(), qty: "", reasonId: "", remarks: "" },
  });

  const handleOpenChange = async (next) => {
    if (!next && isDirty) {
      const ok = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. They will be lost if you close this form.",
        confirmText: "Discard",
        cancelText: "Keep editing",
        variant: "destructive",
      });
      if (!ok) return;
    }
    onOpenChange(next);
  };

  const onSubmit = async (values) => {
    try {
      await createMutation.mutateAsync({
        detailId: Number(detailId),
        mortalityDate: values.mortalityDate,
        qty: values.qty,
        reasonId: Number(values.reasonId),
        remarks: values.remarks?.trim() || null,
      });
      toast.success("Mortality record added successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add mortality record. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add mortality</SheetTitle>
          <SheetDescription>Record chickens that died in this detail.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <div className="space-y-4 px-4">
            <div className="space-y-1.5">
              <Label htmlFor="mortalityDate">Date</Label>
              <Input id="mortalityDate" type="date" {...register("mortalityDate")} />
              {errors.mortalityDate && (
                <p className="text-xs text-red-600">{errors.mortalityDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qty">Number of chickens died</Label>
              <Input id="qty" type="number" min={1} step={1} {...register("qty")} />
              {errors.qty && <p className="text-xs text-red-600">{errors.qty.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Controller
                name="reasonId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={reasonsLoading ? "Loading reasons..." : "Select reason"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map((r) => (
                        <SelectItem key={r.ID} value={String(r.ID)}>
                          {r.REASON_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reasonId && (
                <p className="text-xs text-red-600">{errors.reasonId.message}</p>
              )}
              {!reasonsLoading && reasons.length === 0 && (
                <p className="text-xs text-gray-400">
                  No reasons found. Add some from the Mortality Reasons page first.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" rows={3} {...register("remarks")} />
              {errors.remarks && <p className="text-xs text-red-600">{errors.remarks.message}</p>}
            </div>
          </div>

          <SheetFooter className="mt-6 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
              Add mortality
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}