import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Target } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateKpiTarget, useFarmTypes } from "./queries";

const formSchema = z.object({
  kpiName:     z.string().min(1, "KPI name is required").max(200),
  farmType:    z.string().optional(),
  targetValue: z.coerce.number({ invalid_type_error: "Number required" }).optional().or(z.literal("")),
  unit:        z.string().optional(),
  actualValue: z.coerce.number().optional().or(z.literal("")),
  remarks:     z.string().optional(),
});

export default function UpdateKpiSheet({ open, onOpenChange, showConfirmation, record, calendarId }) {
  const updateMutation = useUpdateKpiTarget(calendarId);
  const { data: farmTypes = [] } = useFarmTypes();

  const defaultValues = {
    kpiName:     record?.KPI_NAME ?? "",
    farmType:    record?.FARM_TYPE ?? "",
    targetValue: record?.TARGET_VALUE ?? "",
    unit:        record?.UNIT ?? "",
    actualValue: record?.ACTUAL_VALUE ?? "",
    remarks:     record?.REMARKS ?? "",
  };

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, record]);

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: record.KPI_ID,
        data: {
          kpiName:     data.kpiName,
          farmType:    data.farmType || null,
          targetValue: data.targetValue === "" ? null : data.targetValue,
          unit:        data.unit || null,
          actualValue: data.actualValue === "" ? null : data.actualValue,
          remarks:     data.remarks || null,
        },
      });
      toast.success("KPI target updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update KPI target. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (isDirty && showConfirmation) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. Are you sure you want to close without saving?",
        confirmText: "Discard",
        cancelText: "Keep Editing",
        variant: "destructive",
      });
      if (!confirmed) return;
    }
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit KPI Target</SheetTitle>
              <SheetDescription>Update this KPI target</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="kpiName" render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="farmType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-110">
                      {farmTypes.map((ft) => (
                        <SelectItem key={ft.FARM_TYPE_ID} value={ft.FARM_TYPE_CODE}>
                          {ft.FARM_TYPE_CODE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="targetValue" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Value</FormLabel>
                  <FormControl><Input type="number" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="unit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="actualValue" render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Value</FormLabel>
                  <FormControl><Input type="number" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="remarks" render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl><Textarea rows={2} disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}