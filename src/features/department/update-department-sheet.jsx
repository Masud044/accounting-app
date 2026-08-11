import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Edit department</SheetTitle>
          <SheetDescription>Update this department's details.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="departmentName">Department name</Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departmentCode">Department code</Label>
            <Input
              id="departmentCode"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <SheetFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}