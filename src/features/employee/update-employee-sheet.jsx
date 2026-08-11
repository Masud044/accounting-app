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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateEmployee, useEmployees, useDepartmentsLookup } from "./queries";

export default function UpdateEmployeeSheet({ open, onOpenChange, record }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [managerId, setManagerId] = useState("");

  const { data: departments = [] } = useDepartmentsLookup();
  const { data: employees = [] } = useEmployees(false);
  const updateMutation = useUpdateEmployee();

  useEffect(() => {
    if (record) {
      setFirstName(record.FIRST_NAME || "");
      setLastName(record.LAST_NAME || "");
      setEmail(record.EMAIL || "");
      setPhone(record.PHONE || "");
      setJobTitle(record.JOB_TITLE || "");
      setDepartmentId(record.DEPARTMENT_ID ? String(record.DEPARTMENT_ID) : "");
      setManagerId(record.MANAGER_ID ? String(record.MANAGER_ID) : "");
    }
  }, [record]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("First name, last name, and email are required.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: record.EMPLOYEE_ID,
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          jobTitle: jobTitle.trim() || null,
          departmentId: departmentId ? Number(departmentId) : null,
          managerId: managerId ? Number(managerId) : null,
        },
      });
      toast.success("Employee updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update employee. Please try again.");
    }
  };

  // An employee can't be their own manager
  const managerOptions = employees.filter((emp) => emp.EMPLOYEE_ID !== record?.EMPLOYEE_ID);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader>
          <SheetTitle>Edit employee</SheetTitle>
          <SheetDescription>Update this employee's details.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job title <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div className="grid gap-2">
            <Label>Department <span className="text-muted-foreground">(optional)</span></Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent className="z-110">
                {departments.map((dep) => (
                  <SelectItem key={dep.DEPARTMENT_ID} value={String(dep.DEPARTMENT_ID)}>
                    {dep.DEPARTMENT_NAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Manager <span className="text-muted-foreground">(optional)</span></Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
              <SelectContent className="z-110">
                {managerOptions.map((emp) => (
                  <SelectItem key={emp.EMPLOYEE_ID} value={String(emp.EMPLOYEE_ID)}>
                    {emp.FIRST_NAME} {emp.LAST_NAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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