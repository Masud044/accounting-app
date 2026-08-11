import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { SectionContainer } from "@/components/SectionContainer";
import AgendaForm from "./agenda-form";
import { useCreateMeeting } from "./queries";

export default function AddAgendaPage() {
  const navigate = useNavigate();
  const createMutation = useCreateMeeting();

  const handleSubmit = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success(
        payload.status === "DRAFT" ? "Meeting saved as draft!" : "Meeting scheduled successfully!"
      );
      navigate("/dashboard/agenda");
    } catch (err) {
      toast.error(err?.message || "Failed to save meeting. Please try again.");
    }
  };

  return (
    <SectionContainer>
      <AgendaForm
        mode="add"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </SectionContainer>
  );
}