import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDepartments, useEmployees, useMeetingRooms } from "./queries";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind rewrite of the original agenda_sheet design (previously scoped CSS
// with custom CSS vars). Same look, same layout, same behavior — just Tailwind
// utility classes now, with a white (bg-white) card surface.
// ─────────────────────────────────────────────────────────────────────────────

const emptyParticipant = () => ({ employeeId: "", role: "ATTENDEE", rsvpStatus: "PENDING" });
const emptyAgendaItem = () => ({ topic: "", presenterId: "", durationMinutes: 15 });

// Splits an ISO-like "YYYY-MM-DDTHH:MM:SS" string into { date, time }
const splitDateTime = (isoLike) => {
  if (!isoLike) return { date: "", time: "" };
  const [date, timePart] = isoLike.split("T");
  const time = timePart ? timePart.slice(0, 5) : "";
  return { date, time };
};

// Shared field control classes (input/select/textarea)
const controlClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14.5px] text-gray-900 " +
  "transition-colors placeholder:text-gray-400 focus:outline-none focus:border-amber-700 " +
  "focus:ring-2 focus:ring-amber-100";

const iconBtnClass =
  "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white " +
  "text-gray-400 text-base leading-none transition-colors hover:border-red-400 hover:text-red-500 hover:bg-red-50";

export default function AgendaForm({ mode = "add", initialData = null, onSubmit, isSubmitting }) {
  const navigate = useNavigate();

  const { data: departments = [] } = useDepartments();
  const { data: employees = [] } = useEmployees();
  const { data: rooms = [] } = useMeetingRooms();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [meetingType, setMeetingType] = useState("IN_PERSON");
  const [roomId, setRoomId] = useState("");
  const [virtualLink, setVirtualLink] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [participants, setParticipants] = useState([emptyParticipant()]);
  const [agendaItems, setAgendaItems] = useState([emptyAgendaItem()]);

  // Prefill on edit
  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.TITLE || "");
    setDescription(initialData.DESCRIPTION || "");
    setOrganizerId(initialData.ORGANIZER_ID ? String(initialData.ORGANIZER_ID) : "");
    setDepartmentId(initialData.DEPARTMENT_ID ? String(initialData.DEPARTMENT_ID) : "");
    setMeetingType(initialData.MEETING_TYPE || "IN_PERSON");
    setRoomId(initialData.ROOM_ID ? String(initialData.ROOM_ID) : "");
    setVirtualLink(initialData.VIRTUAL_LINK || "");

    const { date: d, time: st } = splitDateTime(initialData.START_TIME);
    const { time: et } = splitDateTime(initialData.END_TIME);
    setDate(d);
    setStart(st);
    setEnd(et);

    if (Array.isArray(initialData.participants) && initialData.participants.length > 0) {
      setParticipants(
        initialData.participants.map((p) => ({
          employeeId: String(p.EMPLOYEE_ID),
          role: p.ROLE || "ATTENDEE",
          rsvpStatus: p.RSVP_STATUS || "PENDING",
        }))
      );
    }
    if (Array.isArray(initialData.agendaItems) && initialData.agendaItems.length > 0) {
      setAgendaItems(
        initialData.agendaItems.map((a) => ({
          topic: a.TOPIC || "",
          presenterId: a.PRESENTER_ID ? String(a.PRESENTER_ID) : "",
          durationMinutes: a.DURATION_MINUTES ?? 15,
        }))
      );
    }
  }, [initialData]);

  const agendaTotal = useMemo(
    () => agendaItems.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
    [agendaItems]
  );

  const updateParticipant = (idx, patch) =>
    setParticipants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const addParticipantRow = () => setParticipants((rows) => [...rows, emptyParticipant()]);

  const removeParticipantRow = (idx) =>
    setParticipants((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

  const updateAgendaItem = (idx, patch) =>
    setAgendaItems((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const addAgendaRow = () => setAgendaItems((rows) => [...rows, emptyAgendaItem()]);

  const removeAgendaRow = (idx) =>
    setAgendaItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

  const buildPayload = (status) => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return null;
    }
    if (!organizerId) {
      toast.error("Organizer is required.");
      return null;
    }
    if (!date || !start || !end) {
      toast.error("Date, start time, and end time are required.");
      return null;
    }

    return {
      title: title.trim(),
      description: description.trim() || null,
      organizerId: Number(organizerId),
      departmentId: departmentId ? Number(departmentId) : null,
      roomId: roomId ? Number(roomId) : null,
      meetingType,
      virtualLink: virtualLink.trim() || null,
      startTime: new Date(`${date}T${start}`),
      endTime: new Date(`${date}T${end}`),
      status,
      participants: participants
        .filter((p) => p.employeeId)
        .map((p) => ({
          employeeId: Number(p.employeeId),
          role: p.role,
          rsvpStatus: p.rsvpStatus,
        })),
      agendaItems: agendaItems
        .filter((a) => a.topic.trim())
        .map((a, idx) => ({
          itemOrder: idx + 1,
          topic: a.topic.trim(),
          presenterId: a.presenterId ? Number(a.presenterId) : null,
          durationMinutes: a.durationMinutes ? Number(a.durationMinutes) : null,
        })),
    };
  };

  const handleSaveDraft = () => {
    const payload = buildPayload("DRAFT");
    if (payload) onSubmit(payload);
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    const payload = buildPayload("SCHEDULED");
    if (payload) onSubmit(payload);
  };

  return (
    <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
      {/* HEADER */}
     

      <form onSubmit={handleSchedule}>
        {/* MEETING DETAILS */}
        <div className="border-b border-gray-200 px-11 py-8">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="font-serif text-[19px] font-medium text-gray-900">Meeting Details</div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="title" className="text-[12.5px] font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Q3 strategy review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={controlClass}
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="description" className="text-[12.5px] font-medium text-gray-600">
                Description <span className="font-normal italic text-gray-400">(optional)</span>
              </label>
              <textarea
                id="description"
                placeholder="What's this meeting about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${controlClass} min-h-[64px] resize-y`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="organizer" className="text-[12.5px] font-medium text-gray-600">
                Organizer
              </label>
              <select
                id="organizer"
                value={organizerId}
                onChange={(e) => setOrganizerId(e.target.value)}
                required
                className={controlClass}
              >
                <option value="" disabled>
                  Select organizer
                </option>
                {employees.map((emp) => (
                  <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
                    {emp.FIRST_NAME} {emp.LAST_NAME}
                    {emp.JOB_TITLE ? ` — ${emp.JOB_TITLE}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="department" className="text-[12.5px] font-medium text-gray-600">
                Department
              </label>
              <select
                id="department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={controlClass}
              >
                <option value="" disabled>
                  Select department
                </option>
                {departments.map((dep) => (
                  <option key={dep.DEPARTMENT_ID} value={dep.DEPARTMENT_ID}>
                    {dep.DEPARTMENT_NAME}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-gray-600">Meeting type</label>
              <div className="flex gap-2">
                {[
                  { value: "IN_PERSON", label: "In person" },
                  { value: "VIRTUAL", label: "Virtual" },
                  { value: "HYBRID", label: "Hybrid" },
                ].map((opt) => (
                  <label key={opt.value} className="relative flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="meetingType"
                      value={opt.value}
                      checked={meetingType === opt.value}
                      onChange={() => setMeetingType(opt.value)}
                      className="absolute inset-0 m-0 cursor-pointer opacity-0"
                    />
                    <span
                      className={`block rounded-lg border px-2 py-2.5 text-center text-[13px] transition-colors ${
                        meetingType === opt.value
                          ? "border-amber-700 bg-amber-50 font-medium text-amber-800"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="room" className="text-[12.5px] font-medium text-gray-600">
                Room <span className="font-normal italic text-gray-400">(optional)</span>
              </label>
              <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className={controlClass}>
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.ROOM_ID} value={room.ROOM_ID}>
                    {room.ROOM_NAME}
                    {room.CAPACITY ? ` · ${room.CAPACITY} seats` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="link" className="text-[12.5px] font-medium text-gray-600">
                Video link <span className="font-normal italic text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="link"
                placeholder="https://meet.company.com/..."
                value={virtualLink}
                onChange={(e) => setVirtualLink(e.target.value)}
                className={controlClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-[12.5px] font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={controlClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="start" className="text-[12.5px] font-medium text-gray-600">
                    Start time
                  </label>
                  <input
                    type="time"
                    id="start"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                    className={controlClass}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="end" className="text-[12.5px] font-medium text-gray-600">
                    End time
                  </label>
                  <input
                    type="time"
                    id="end"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                    className={controlClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PARTICIPANTS */}
        <div className="border-b border-gray-200 px-11 py-8">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="font-serif text-[19px] font-medium text-gray-900">Participants</div>
            <div className="text-[12.5px] text-gray-400">{participants.length} invited</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {participants.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_1.4fr_1.2fr_32px] items-center gap-2.5 sm:grid-cols-[2fr_1.4fr_1.2fr_32px] max-sm:grid-cols-2"
              >
                <select
                  value={row.employeeId}
                  onChange={(e) => updateParticipant(idx, { employeeId: e.target.value })}
                  className={controlClass}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
                      {emp.FIRST_NAME} {emp.LAST_NAME}
                    </option>
                  ))}
                </select>
                <select
                  value={row.role}
                  onChange={(e) => updateParticipant(idx, { role: e.target.value })}
                  className={controlClass}
                >
                  <option value="ATTENDEE">Attendee</option>
                  <option value="PRESENTER">Presenter</option>
                  <option value="OPTIONAL">Optional</option>
                </select>
                <select
                  value={row.rsvpStatus}
                  onChange={(e) => updateParticipant(idx, { rsvpStatus: e.target.value })}
                  className={controlClass}
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="TENTATIVE">Tentative</option>
                </select>
                <button
                  type="button"
                  aria-label="Remove participant"
                  onClick={() => removeParticipantRow(idx)}
                  className={iconBtnClass}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParticipantRow}
            className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
              +
            </span>
            Add participant
          </button>
        </div>

        {/* AGENDA */}
        <div className="px-11 py-8">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="font-serif text-[19px] font-medium text-gray-900">Agenda</div>
            <div className="text-[12.5px] text-gray-400">Ordered as it will be presented</div>
          </div>
          <div className="flex flex-col">
            {agendaItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[28px_1fr_auto_1px_90px_32px] items-center gap-3.5 border-b border-dashed border-gray-200 py-3.5 first:pt-0 max-sm:grid-cols-[24px_1fr_32px] max-sm:gap-2"
              >
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-amber-50 font-mono text-[13px] text-amber-800">
                  {idx + 1}
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <input
                    type="text"
                    placeholder="Topic"
                    value={item.topic}
                    onChange={(e) => updateAgendaItem(idx, { topic: e.target.value })}
                    className="border-0 bg-transparent px-0 py-0.5 text-[14.5px] font-medium text-gray-900 focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
                  />
                  <select
                    value={item.presenterId}
                    onChange={(e) => updateAgendaItem(idx, { presenterId: e.target.value })}
                    className="border-0 bg-transparent p-0 text-[12px] text-gray-400 focus:outline-none focus:ring-0"
                  >
                    <option value="">No presenter</option>
                    {employees.map((emp) => (
                      <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
                        Presenter: {emp.FIRST_NAME} {emp.LAST_NAME}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-[11px] h-0 w-full min-w-6 self-end border-b border-dotted border-gray-300 max-sm:hidden" />
                <div className="max-sm:hidden" />
                <div className="flex items-center gap-1.5 font-mono text-[12.5px] text-gray-600 max-sm:col-start-2">
                  <input
                    type="number"
                    min="0"
                    value={item.durationMinutes}
                    onChange={(e) => updateAgendaItem(idx, { durationMinutes: e.target.value })}
                    className="w-11 border-0 bg-transparent p-0.5 text-right font-mono text-[12.5px] focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
                  />
                  min
                </div>
                <button
                  type="button"
                  aria-label="Remove agenda item"
                  onClick={() => removeAgendaRow(idx)}
                  className={iconBtnClass}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addAgendaRow}
            className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
              +
            </span>
            Add agenda item
          </button>
          <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-3.5">
            <span className="text-[12.5px] text-gray-400">Estimated total</span>
            <span className="font-mono text-[15px] font-medium text-gray-900">{agendaTotal} min</span>
          </div>
        </div>
      </form>

      {/* FOOTER */}
      <div className="flex flex-col items-stretch justify-between gap-4 border-t border-gray-200 bg-white px-11 py-7 sm:flex-row sm:items-center">
        <div className="flex gap-2.5 sm:justify-end">
          <Button
            type="button"
            onClick={() => navigate("/dashboard/agenda")}
           
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}>
           
            Save as draft
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={isSubmitting}
            
          >
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Schedule meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}