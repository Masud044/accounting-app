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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Syringe } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateVaccination } from "./queries";

const formSchema = z.object({
  vaccinName:     z.string().min(1, "Vaccine name is required").max(100),
  doses:          z.string().min(1, "Doses is required").max(50),
  vaccinDate:     z.string().min(1, "Vaccination date is required"),
  nextVaccinDate: z.string().optional().or(z.literal("")),
});

const defaultValues = { vaccinName: "", doses: "", vaccinDate: "", nextVaccinDate: "" };

export default function AddVaccinationSheet({ open, onOpenChange, showConfirmation, hid }) {
  const createMutation = useCreateVaccination(hid);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        hid,
        vaccinName:     data.vaccinName,
        doses:          data.doses,
        vaccinDate:     data.vaccinDate,
        nextVaccinDate: data.nextVaccinDate || null,
      });
      toast.success("Vaccination record added successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add vaccination record. Please try again.");
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
              <Syringe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Vaccination</SheetTitle>
              <SheetDescription>Record a vaccine dose for this batch</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="vaccinName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Newcastle Disease" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="doses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Doses <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1 drop / bird" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="vaccinDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccination Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nextVaccinDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Vaccination Date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Adding...</> : "Add Vaccination"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}