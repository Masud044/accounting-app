import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

import AgendaForm from "./agenda-form";
import { useMeetingById, useUpdateMeeting } from "./queries";

export default function UpdateAgendaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: meeting, isLoading, isError, error } = useMeetingById(id);
  const updateMutation = useUpdateMeeting();

  const handleSubmit = async (payload) => {
    try {
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success(
        payload.status === "DRAFT" ? "Meeting saved as draft!" : "Meeting updated successfully!"
      );
      navigate("/agenda");
    } catch (err) {
      toast.error(err?.message || "Failed to update meeting. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SectionContainer>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading meeting...</p>
          </div>
        </div>
      </SectionContainer>
    );
  }

  if (isError || !meeting) {
    return (
      <SectionContainer>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Meeting</AlertTitle>
            <AlertDescription>
              {error?.message || "Meeting not found."}
            </AlertDescription>
          </Alert>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <AgendaForm
        mode="edit"
        initialData={meeting}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </SectionContainer>
  );
}