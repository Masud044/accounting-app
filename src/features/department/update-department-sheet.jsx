// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetFooter,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Spinner } from "@/components/ui/spinner";

// import { useUpdateDepartment } from "./queries";

// export default function UpdateDepartmentSheet({ open, onOpenChange, record }) {
//   const [departmentName, setDepartmentName] = useState("");
//   const [departmentCode, setDepartmentCode] = useState("");

//   const updateMutation = useUpdateDepartment();

//   useEffect(() => {
//     if (record) {
//       setDepartmentName(record.DEPARTMENT_NAME || "");
//       setDepartmentCode(record.DEPARTMENT_CODE || "");
//     }
//   }, [record]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!departmentName.trim() || !departmentCode.trim()) {
//       toast.error("Department name and code are required.");
//       return;
//     }
//     try {
//       await updateMutation.mutateAsync({
//         id: record.DEPARTMENT_ID,
//         data: {
//           departmentName: departmentName.trim(),
//           departmentCode: departmentCode.trim(),
//         },
//       });
//       toast.success("Department updated successfully!");
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to update department. Please try again.");
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
//         <SheetHeader>
//           <SheetTitle>Edit department</SheetTitle>
//           <SheetDescription>Update this department's details.</SheetDescription>
//         </SheetHeader>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
//           <div className="grid gap-2">
//             <Label htmlFor="departmentName">Department name</Label>
//             <Input
//               id="departmentName"
//               value={departmentName}
//               onChange={(e) => setDepartmentName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="departmentCode">Department code</Label>
//             <Input
//               id="departmentCode"
//               value={departmentCode}
//               onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
//               required
//             />
//           </div>

//           <SheetFooter className="px-0">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={updateMutation.isPending}>
//               {updateMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save changes"}
//             </Button>
//           </SheetFooter>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Building2, X } from "lucide-react";

import { useUpdateDepartment } from "./queries";

export default function UpdateDepartmentSheet({ open, onOpenChange, record }) {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");

  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    if (record) {
      setDepartmentName(record.DEPARTMENT_NAME || "");
      setDepartmentCode(record.DEPARTMENT_CODE || "");
    }
  }, [record]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim() || !departmentCode.trim()) {
      toast.error("Department name and code are required.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: record.DEPARTMENT_ID,
        data: {
          departmentName: departmentName.trim(),
          departmentCode: departmentCode.trim(),
        },
      });
      toast.success("Department updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update department. Please try again.");
    }
  };

  const isSubmitting = updateMutation.isPending;

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
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Edit Department
              </DialogTitle>
              <DialogDescription>Update this department's details</DialogDescription>
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
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 sm:col-span-2">
                <Label
                  htmlFor="departmentName"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Department Name
                </Label>
                <Input
                  id="departmentName"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                  className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="departmentCode"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Department Code
                </Label>
                <Input
                  id="departmentCode"
                  value={departmentCode}
                  onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                  className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-sm">
              {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}