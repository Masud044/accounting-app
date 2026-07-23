import { useEffect, useMemo } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { ListChecks } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateFarmProjectActivity } from "./queries";

const STATUS_OPTIONS = ["PLANNED", "ACTIVE", "COMPLETE", "CANCELLED"];

// Schema is built per-open so date bounds can be validated against the selected phase.
const makeSchema = (phases) =>
  z.object({
    phaseId:        z.string().min(1, "Phase is required"),
    activityName:   z.string().min(1, "Activity name is required").max(200),
    planStartDate:  z.string().min(1, "Plan start date is required"),
    planEndDate:    z.string().min(1, "Plan end date is required"),
    status:         z.string().min(1, "Status is required"),
  }).superRefine((d, ctx) => {
    if (d.planEndDate && d.planStartDate && d.planEndDate < d.planStartDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End date must be on or after start date", path: ["planEndDate"] });
      return;
    }
    const phase = phases.find((p) => String(p.PHASE_ID) === d.phaseId);
    if (!phase) return;
    if (d.planStartDate && d.planStartDate < phase.START_DATE) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be on or after phase start (${phase.START_DATE})`, path: ["planStartDate"] });
    }
    if (d.planEndDate && phase.END_DATE && d.planEndDate > phase.END_DATE) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be on or before phase end (${phase.END_DATE})`, path: ["planEndDate"] });
    }
  });

const defaultValues = { phaseId: "", activityName: "", planStartDate: "", planEndDate: "", status: "PLANNED" };

export default function AddActivitySheet({ open, onOpenChange, showConfirmation, projectId, phases }) {
  const createMutation = useCreateFarmProjectActivity(projectId);

  const formSchema = useMemo(() => makeSchema(phases), [phases]);
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open]);

  const selectedPhaseId = form.watch("phaseId");
  const selectedPhase = phases.find((p) => String(p.PHASE_ID) === selectedPhaseId);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        phaseId:       Number(data.phaseId),
        activityName:  data.activityName,
        planStartDate: data.planStartDate,
        planEndDate:   data.planEndDate,
        status:        data.status,
      });
      toast.success("Activity added successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add activity. Please try again.");
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
    form.reset(defaultValues);
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Activity</SheetTitle>
              <SheetDescription>Add a planned activity for this project</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="phaseId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select phase" /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-110">
                      {phases.map((p) => (
                        <SelectItem key={p.PHASE_ID} value={String(p.PHASE_ID)}>
                          {p.PHASE_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPhase && (
                    <FormDescription>
                      Phase window: {selectedPhase.START_DATE} to {selectedPhase.END_DATE || "—"}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="activityName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Vaccination" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="planStartDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Start Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isSubmitting}
                      min={selectedPhase?.START_DATE || undefined}
                      max={selectedPhase?.END_DATE || undefined}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="planEndDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan End Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isSubmitting}
                      min={selectedPhase?.START_DATE || undefined}
                      max={selectedPhase?.END_DATE || undefined}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-110">
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Adding...</> : "Add Activity"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}