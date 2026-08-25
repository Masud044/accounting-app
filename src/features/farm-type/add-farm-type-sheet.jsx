// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "react-toastify";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Layers } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";
// import { useCreateFarmType } from "./queries";

// // ── Validation Schema ────────────────────────────────────────────────────────
// const formSchema = z.object({
//   farmTypeName: z.string().min(1, "Farm type name is required").max(100),
//   farmTypeCode: z.string().min(1, "Farm type code is required").max(30),
// });

// const defaultValues = {
//   farmTypeName: "",
//   farmTypeCode: "",
// };

// export default function AddFarmTypeSheet({ open, onOpenChange, showConfirmation }) {
//   const createMutation = useCreateFarmType();

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues,
//   });

//   const { formState: { isDirty } } = form;

//   useEffect(() => {
//     if (open) form.reset(defaultValues);
//   }, [open]);

//   const onSubmit = async (data) => {
//     try {
//       await createMutation.mutateAsync({
//         farmTypeName: data.farmTypeName,
//         farmTypeCode: data.farmTypeCode,
//       });
//       toast.success("Farm type created successfully!");
//       form.reset(defaultValues);
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to create record. Please try again.");
//     }
//   };

//   const handleCancel = async () => {
//     if (isDirty && showConfirmation) {
//       const confirmed = await showConfirmation({
//         title: "Discard changes?",
//         description: "You have unsaved changes. Are you sure you want to close without saving?",
//         confirmText: "Discard",
//         cancelText: "Keep Editing",
//         variant: "destructive",
//       });
//       if (!confirmed) return;
//     }
//     form.reset(defaultValues);
//     onOpenChange(false);
//   };

//   const isSubmitting = createMutation.isPending;

//   return (
//     <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
//       <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">

//         {/* Header */}
//         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <Layers className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <SheetTitle>Add Farm Type</SheetTitle>
//               <SheetDescription>Create a new farm type record</SheetDescription>
//             </div>
//           </div>
//         </SheetHeader>

//         {/* Form */}
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
//             <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//               <FormField control={form.control} name="farmTypeName" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Farm Type Name <span className="text-destructive">*</span></FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Poultry" disabled={isSubmitting} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="farmTypeCode" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Farm Type Code <span className="text-destructive">*</span></FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. PLT" disabled={isSubmitting} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
//               <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Record"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Layers, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateFarmType } from "./queries";

// ── Validation Schema ────────────────────────────────────────────────────────
const formSchema = z.object({
  farmTypeName: z.string().min(1, "Farm type name is required").max(100),
  farmTypeCode: z.string().min(1, "Farm type code is required").max(30),
});

const defaultValues = {
  farmTypeName: "",
  farmTypeCode: "",
};

export default function AddFarmTypeSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateFarmType();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        farmTypeName: data.farmTypeName,
        farmTypeCode: data.farmTypeCode,
      });
      toast.success("Farm type created successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create record. Please try again.");
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
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg w-full p-0 gap-0 overflow-hidden border-border/60 shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="relative px-6 py-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/20 shadow-sm">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Add Farm Type
              </DialogTitle>
              <DialogDescription>Create a new farm type record</DialogDescription>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="absolute top-5 right-5 rounded-lg p-1.5 text-muted-foreground/70 hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 py-6 space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <FormField control={form.control} name="farmTypeName" render={({ field }) => (
    <FormItem className="sm:col-span-2">
      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Farm Type Name <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input
          placeholder="e.g. Poultry"
          disabled={isSubmitting}
          autoFocus
          className="bg-gray-100 border-muted-foreground/20 focus-visible:bg-background"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />

  <FormField control={form.control} name="farmTypeCode" render={({ field }) => (
    <FormItem>
      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Farm Type Code <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input
          placeholder="e.g. PLT"
          disabled={isSubmitting}
          className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background uppercase"
          {...field}
          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />
</div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="shadow-sm">
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Record"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}