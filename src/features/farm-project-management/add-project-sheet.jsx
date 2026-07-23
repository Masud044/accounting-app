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
import { FolderKanban } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateFarmProject } from "./queries";

const STATUS_OPTIONS = ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"];

const formSchema = z.object({
  projectCode:  z.string().min(1, "Project code is required").max(30),
  projectName:  z.string().min(1, "Project name is required").max(200),
  projectType:  z.string().optional(),
  startDate:    z.string().min(1, "Start date is required"),
  endDate:      z.string().min(1, "End date is required"),
  budgetAmount: z.coerce.number({ invalid_type_error: "Number required" }).optional().or(z.literal("")),
  status:       z.string().min(1, "Status is required"),
}).refine((d) => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

const defaultValues = {
  projectCode: "", projectName: "", projectType: "", startDate: "", endDate: "",
  budgetAmount: "", status: "PLANNED",
};

export default function AddFarmProjectSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateFarmProject();

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        projectCode:  data.projectCode,
        projectName:  data.projectName,
        projectType:  data.projectType || null,
        startDate:    data.startDate,
        endDate:      data.endDate,
        budgetAmount: data.budgetAmount === "" ? null : data.budgetAmount,
        status:       data.status,
      });
      toast.success("Farm project created successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create project. Please try again.");
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
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Farm Project</SheetTitle>
              <SheetDescription>Create a new farm project</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="projectCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Code <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. FP-2027-01" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Broiler Expansion Phase 1" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl><Input placeholder="e.g. Poultry, Fishery" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="date" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="date" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="budgetAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}