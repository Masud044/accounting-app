import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useMeetingById } from "./queries";
import ActionItemsBoard from "./action-item-card";
import AttachmentsPanel from "./attachment-panel";
import NotificationsPanel from "./notification-panel";

const STATUS_VARIANT = {
  DRAFT:     "secondary",
  SCHEDULED: "default",
  CANCELLED: "destructive",
  COMPLETED: "outline",
};

const formatDateRange = (startIso, endIso) => {
  if (!startIso) return "—";
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;
  const datePart = start.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const startTime = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endTime = end ? end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : null;
  return endTime ? `${datePart}, ${startTime} to ${endTime}` : `${datePart}, ${startTime}`;
};

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: meeting, isLoading, isError, error } = useMeetingById(id);

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
            <AlertDescription>{error?.message || "Meeting not found."}</AlertDescription>
          </Alert>
        </div>
      </SectionContainer>
    );
  }

  const status = meeting.STATUS || "SCHEDULED";
  const participantNames = (meeting.participants || [])
    .map((p) => p.EMPLOYEE_NAME)
    .filter(Boolean);

  return (
    <SectionContainer>
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 mt-0.5" onClick={() => navigate("/dashboard/agenda")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-2xl font-semibold tracking-tight">{meeting.TITLE}</h1>
                <Badge variant={STATUS_VARIANT[status] || "default"} className="capitalize">
                  {status.toLowerCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDateRange(meeting.START_TIME, meeting.END_TIME)}
                {meeting.ROOM_ID ? ` · Room ${meeting.ROOM_ID}` : ""}
                {participantNames.length > 0 ? ` · ${participantNames.length} participants` : ""}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate(`/dashboard/agenda/edit/${id}`)}>
            <IconEdit className="mr-1 h-4 w-4" />Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="action-items" className="w-full">
        <TabsList>
          <TabsTrigger value="action-items">Action items</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="action-items" className="mt-4">
          <ActionItemsBoard meetingId={id} agendaItems={meeting.agendaItems || []} participants={meeting.participants || []} />
        </TabsContent>

        <TabsContent value="attachments" className="mt-4">
          <AttachmentsPanel meetingId={id} agendaItems={meeting.agendaItems || []} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <NotificationsPanel meetingId={id} participants={meeting.participants || []} />
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}