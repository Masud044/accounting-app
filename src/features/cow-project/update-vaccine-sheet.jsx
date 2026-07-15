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
import { useUpdateCowMedicine } from "./queries";

const formSchema = z.object({
  vaccineName:     z.string().min(1, "Vaccine name is required"),
  vaccineDate:     z.string().min(1, "Vaccine date is required"),
  nextVaccineDate: z.string().optional(),
  priceWithDoctor: z.coerce.number().optional().or(z.literal("")),
});

const defaultValues = {
  vaccineName:     "",
  vaccineDate:     "",
  nextVaccineDate: "",
  priceWithDoctor: "",
};

export default function UpdateVaccineSheet({ open, onOpenChange, showConfirmation, record, cowNo }) {
  const updateMutation = useUpdateCowMedicine();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        vaccineName:     record.VACCINE_NAME ?? "",
        vaccineDate:     record.VACCINE_DATE ?? "",
        nextVaccineDate: record.NEXT_VACCINE_DATE ?? "",
        priceWithDoctor: record.PRICE_WITH_DOCTOR ?? "",
      });
    }
  }, [open, record?.ID]);

  const onSubmit = async (data) => {
    if (!record?.ID) { toast.error("Record ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.ID,
        data: {
          cowNo,
          vaccineName:     data.vaccineName,
          vaccineDate:     data.vaccineDate,
          nextVaccineDate: data.nextVaccineDate || null,
          priceWithDoctor: data.priceWithDoctor === "" ? null : data.priceWithDoctor,
        },
      });
      toast.success("Vaccine record updated successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update vaccine record. Please try again.");
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
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">

        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Syringe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Vaccine Record</SheetTitle>
              <SheetDescription>Editing record #{record?.ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <FormField control={form.control} name="vaccineName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. FMD Vaccine" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="vaccineDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nextVaccineDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Vaccine Date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="priceWithDoctor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price With Doctor</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} />
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}