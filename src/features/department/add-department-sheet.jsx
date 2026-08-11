import { useState } from "react";
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

import { useCreateDepartment } from "./queries";

export default function AddDepartmentSheet({ open, onOpenChange }) {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");

  const createMutation = useCreateDepartment();

  const resetForm = () => {
    setDepartmentName("");
    setDepartmentCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim() || !departmentCode.trim()) {
      toast.error("Department name and code are required.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        departmentName: departmentName.trim(),
        departmentCode: departmentCode.trim(),
      });
      toast.success("Department created successfully!");
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create department. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Add department</SheetTitle>
          <SheetDescription>Create a new department record.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="departmentName">Department name</Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="e.g. Engineering"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departmentCode">Department code</Label>
            <Input
              id="departmentCode"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
              placeholder="e.g. ENG"
              required
            />
          </div>

          <SheetFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save department"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}