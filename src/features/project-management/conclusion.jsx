import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { useConclusion, useCreateConclusion, useUpdateConclusion } from "./queries";

const formSchema = z.object({
  conclusionText: z.string().min(1, "Conclusion text is required"),
});

export default function ConclusionTab({ projectId }) {
  const { data: record, isLoading } = useConclusion(projectId);
  const createMutation = useCreateConclusion(projectId);
  const updateMutation = useUpdateConclusion(projectId);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { conclusionText: "" } });

  useEffect(() => {
    form.reset({ conclusionText: record?.CONCLUSION_TEXT || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const onSubmit = async (data) => {
    try {
      if (record?.CONCLUSION_ID) {
        await updateMutation.mutateAsync({ id: record.CONCLUSION_ID, data });
        toast.success("Conclusion updated successfully!");
      } else {
        await createMutation.mutateAsync({ projectId: Number(projectId), ...data });
        toast.success("Conclusion added successfully!");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to save conclusion. Please try again.");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">Loading conclusion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!record && (
        <Empty className="py-6">
          <EmptyHeader>
            <EmptyMedia variant="icon"><FileCheck2 /></EmptyMedia>
            <EmptyTitle>No conclusion written yet</EmptyTitle>
            <EmptyDescription>Write the project's closing summary below.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <FormField control={form.control} name="conclusionText" render={({ field }) => (
            <FormItem>
              <FormLabel>Conclusion <span className="text-destructive">*</span></FormLabel>
              <FormControl><Textarea rows={8} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                : record ? "Save Changes" : "Add Conclusion"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}