import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

// ── Build a zod schema from a field config array ────────────────────────────
const buildSchema = (fields) => {
  const shape = {};
  fields.forEach((f) => {
    if (f.type === "number") {
      let s = z.coerce.number({ invalid_type_error: `${f.label} must be a number` });
      shape[f.name] = f.required ? s : s.optional().or(z.literal(""));
    } else {
      let s = z.string();
      shape[f.name] = f.required ? s.min(1, `${f.label} is required`) : s.optional();
    }
  });
  return z.object(shape);
};

const emptyValuesFromFields = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "number" ? "" : ""]));

const recordToFormValues = (record, fields) =>
  Object.fromEntries(
    fields.map((f) => [f.name, record[f.dbKey ?? f.name.toUpperCase()] ?? ""])
  );

const formValuesToPayload = (data, fields, projectId) => {
  const payload = { projectId: Number(projectId) };
  fields.forEach((f) => {
    const v = data[f.name];
    payload[f.name] = f.type === "number" ? (v === "" ? 0 : Number(v)) : (v || null);
  });
  return payload;
};

function ResourceFormFields({ form, fields, isSubmitting }) {
  return (
    <>
      {fields.map((f) => (
        <FormField key={f.name} control={form.control} name={f.name} render={({ field }) => (
          <FormItem>
            <FormLabel>{f.label} {f.required && <span className="text-destructive">*</span>}</FormLabel>
            <FormControl>
              {f.type === "textarea" ? (
                <Textarea rows={3} placeholder={f.placeholder} disabled={isSubmitting} {...field} />
              ) : f.type === "select" ? (
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger><SelectValue placeholder={f.placeholder || `Select ${f.label.toLowerCase()}`} /></SelectTrigger>
                  <SelectContent className="z-110">
                    {f.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={f.type === "number" ? "number" : "text"}
                  step={f.type === "number" ? "0.01" : undefined}
                  placeholder={f.placeholder}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      ))}
    </>
  );
}

function AddResourceSheet({ open, onOpenChange, showConfirmation, config, projectId, useCreate }) {
  const { fields, title, icon: Icon } = config;
  const createMutation = useCreate(projectId);
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaultValues = useMemo(() => emptyValuesFromFields(fields), [fields]);

  const form = useForm({ resolver: zodResolver(schema), defaultValues });
  const { formState: { isDirty } } = form;

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(formValuesToPayload(data, fields, projectId));
      toast.success(`${title} added successfully!`);
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || `Failed to add ${title.toLowerCase()}. Please try again.`);
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
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add {title}</SheetTitle>
              <SheetDescription>Add a new {title.toLowerCase()} entry for this project</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <ResourceFormFields form={form} fields={fields} isSubmitting={isSubmitting} />
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Adding...</> : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function UpdateResourceSheet({ open, onOpenChange, showConfirmation, config, projectId, record, useUpdate }) {
  const { fields, title, icon: Icon, idKey } = config;
  const updateMutation = useUpdate(projectId);
  const schema = useMemo(() => buildSchema(fields), [fields]);

  const form = useForm({ resolver: zodResolver(schema) });
  const { formState: { isDirty } } = form;

  useMemo(() => {
    if (open && record) form.reset(recordToFormValues(record, fields));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, record]);

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: record[idKey], data: formValuesToPayload(data, fields, projectId) });
      toast.success(`${title} updated successfully!`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || `Failed to update ${title.toLowerCase()}. Please try again.`);
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
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit {title}</SheetTitle>
              <SheetDescription>Update this {title.toLowerCase()} entry</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <ResourceFormFields form={form} fields={fields} isSubmitting={isSubmitting} />
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
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

// ── Main exported section: table + add/edit sheets, plugged with a resource config ──
export default function ResourceCrudSection({ projectId, config }) {
  const { title, icon: Icon, idKey, columns: columnDefs, useList, useCreate, useUpdate, useDelete } = config;

  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading } = useList(projectId);
  const deleteMutation = useDelete(projectId);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: `Delete ${title.toLowerCase()}?`,
      description: `Are you sure you want to delete this ${title.toLowerCase()} entry? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record[idKey]);
        toast.success(`${title} deleted successfully!`);
      } catch (err) {
        toast.error(err?.message || `Failed to delete ${title.toLowerCase()}. Please try again.`);
      }
    }
  };

  const columns = useMemo(() => [
    ...columnDefs,
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(record)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? <Spinner className="h-4 w-4" />
                : <Trash2 className="h-4 w-4" />}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [columnDefs, deleteMutation.isPending]);

  const table = useReactTable({
    data: records,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">Loading {title.toLowerCase()}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add {title}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><Icon /></EmptyMedia>
                      <EmptyTitle>No {title.toLowerCase()} added yet</EmptyTitle>
                      <EmptyDescription>Add the first {title.toLowerCase()} entry for this project.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {isAddOpen && (
        <AddResourceSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          config={config}
          projectId={projectId}
          useCreate={useCreate}
        />
      )}
      {isUpdateOpen && (
        <UpdateResourceSheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          config={config}
          projectId={projectId}
          record={selectedRecord}
          useUpdate={useUpdate}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}