// // // import { useEffect, useMemo, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { toast } from "react-toastify";

// // // import { useDepartments, useEmployees, useMeetingRooms } from "./queries";
// // // import { Button } from "@/components/ui/button";

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // // Tailwind rewrite of the original agenda_sheet design (previously scoped CSS
// // // // with custom CSS vars). Same look, same layout, same behavior — just Tailwind
// // // // utility classes now, with a white (bg-white) card surface.
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // const emptyParticipant = () => ({ employeeId: "", role: "ATTENDEE", rsvpStatus: "PENDING" });
// // // const emptyAgendaItem = () => ({ topic: "", presenterId: "", durationMinutes: 15 });

// // // // Splits an ISO-like "YYYY-MM-DDTHH:MM:SS" string into { date, time }
// // // const splitDateTime = (isoLike) => {
// // //   if (!isoLike) return { date: "", time: "" };
// // //   const [date, timePart] = isoLike.split("T");
// // //   const time = timePart ? timePart.slice(0, 5) : "";
// // //   return { date, time };
// // // };

// // // // Shared field control classes (input/select/textarea)
// // // const controlClass =
// // //   "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14.5px] text-gray-900 " +
// // //   "transition-colors placeholder:text-gray-400 focus:outline-none focus:border-amber-700 " +
// // //   "focus:ring-2 focus:ring-amber-100";

// // // const iconBtnClass =
// // //   "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white " +
// // //   "text-gray-400 text-base leading-none transition-colors hover:border-red-400 hover:text-red-500 hover:bg-red-50";

// // // export default function AgendaForm({ mode = "add", initialData = null, onSubmit, isSubmitting }) {
// // //   const navigate = useNavigate();

// // //   const { data: departments = [] } = useDepartments();
// // //   const { data: employees = [] } = useEmployees();
// // //   const { data: rooms = [] } = useMeetingRooms();

// // //   const [title, setTitle] = useState("");
// // //   const [description, setDescription] = useState("");
// // //   const [organizerId, setOrganizerId] = useState("");
// // //   const [departmentId, setDepartmentId] = useState("");
// // //   const [meetingType, setMeetingType] = useState("IN_PERSON");
// // //   const [roomId, setRoomId] = useState("");
// // //   const [virtualLink, setVirtualLink] = useState("");
// // //   const [date, setDate] = useState("");
// // //   const [start, setStart] = useState("");
// // //   const [end, setEnd] = useState("");
// // //   const [participants, setParticipants] = useState([emptyParticipant()]);
// // //   const [agendaItems, setAgendaItems] = useState([emptyAgendaItem()]);

// // //   // Prefill on edit
// // //   useEffect(() => {
// // //     if (!initialData) return;
// // //     setTitle(initialData.TITLE || "");
// // //     setDescription(initialData.DESCRIPTION || "");
// // //     setOrganizerId(initialData.ORGANIZER_ID ? String(initialData.ORGANIZER_ID) : "");
// // //     setDepartmentId(initialData.DEPARTMENT_ID ? String(initialData.DEPARTMENT_ID) : "");
// // //     setMeetingType(initialData.MEETING_TYPE || "IN_PERSON");
// // //     setRoomId(initialData.ROOM_ID ? String(initialData.ROOM_ID) : "");
// // //     setVirtualLink(initialData.VIRTUAL_LINK || "");

// // //     const { date: d, time: st } = splitDateTime(initialData.START_TIME);
// // //     const { time: et } = splitDateTime(initialData.END_TIME);
// // //     setDate(d);
// // //     setStart(st);
// // //     setEnd(et);

// // //     if (Array.isArray(initialData.participants) && initialData.participants.length > 0) {
// // //       setParticipants(
// // //         initialData.participants.map((p) => ({
// // //           employeeId: String(p.EMPLOYEE_ID),
// // //           role: p.ROLE || "ATTENDEE",
// // //           rsvpStatus: p.RSVP_STATUS || "PENDING",
// // //         }))
// // //       );
// // //     }
// // //     if (Array.isArray(initialData.agendaItems) && initialData.agendaItems.length > 0) {
// // //       setAgendaItems(
// // //         initialData.agendaItems.map((a) => ({
// // //           topic: a.TOPIC || "",
// // //           presenterId: a.PRESENTER_ID ? String(a.PRESENTER_ID) : "",
// // //           durationMinutes: a.DURATION_MINUTES ?? 15,
// // //         }))
// // //       );
// // //     }
// // //   }, [initialData]);

// // //   const agendaTotal = useMemo(
// // //     () => agendaItems.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
// // //     [agendaItems]
// // //   );

// // //   const updateParticipant = (idx, patch) =>
// // //     setParticipants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

// // //   const addParticipantRow = () => setParticipants((rows) => [...rows, emptyParticipant()]);

// // //   const removeParticipantRow = (idx) =>
// // //     setParticipants((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

// // //   const updateAgendaItem = (idx, patch) =>
// // //     setAgendaItems((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

// // //   const addAgendaRow = () => setAgendaItems((rows) => [...rows, emptyAgendaItem()]);

// // //   const removeAgendaRow = (idx) =>
// // //     setAgendaItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

// // //   const buildPayload = (status) => {
// // //     if (!title.trim()) {
// // //       toast.error("Title is required.");
// // //       return null;
// // //     }
// // //     if (!organizerId) {
// // //       toast.error("Organizer is required.");
// // //       return null;
// // //     }
// // //     if (!date || !start || !end) {
// // //       toast.error("Date, start time, and end time are required.");
// // //       return null;
// // //     }

// // //     return {
// // //       title: title.trim(),
// // //       description: description.trim() || null,
// // //       organizerId: Number(organizerId),
// // //       departmentId: departmentId ? Number(departmentId) : null,
// // //       roomId: roomId ? Number(roomId) : null,
// // //       meetingType,
// // //       virtualLink: virtualLink.trim() || null,
// // //       startTime: new Date(`${date}T${start}`),
// // //       endTime: new Date(`${date}T${end}`),
// // //       status,
// // //       participants: participants
// // //         .filter((p) => p.employeeId)
// // //         .map((p) => ({
// // //           employeeId: Number(p.employeeId),
// // //           role: p.role,
// // //           rsvpStatus: p.rsvpStatus,
// // //         })),
// // //       agendaItems: agendaItems
// // //         .filter((a) => a.topic.trim())
// // //         .map((a, idx) => ({
// // //           itemOrder: idx + 1,
// // //           topic: a.topic.trim(),
// // //           presenterId: a.presenterId ? Number(a.presenterId) : null,
// // //           durationMinutes: a.durationMinutes ? Number(a.durationMinutes) : null,
// // //         })),
// // //     };
// // //   };

// // //   const handleSaveDraft = () => {
// // //     const payload = buildPayload("DRAFT");
// // //     if (payload) onSubmit(payload);
// // //   };

// // //   const handleSchedule = (e) => {
// // //     e.preventDefault();
// // //     const payload = buildPayload("SCHEDULED");
// // //     if (payload) onSubmit(payload);
// // //   };

// // //   return (
// // //     <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// // //       {/* HEADER */}
     

// // //       <form onSubmit={handleSchedule}>
// // //         {/* MEETING DETAILS */}
// // //         <div className="border-b border-gray-200 px-11 py-8">
// // //           <div className="mb-5 flex items-baseline justify-between">
// // //             <div className="font-serif text-[19px] font-medium text-gray-900">Meeting Details</div>
// // //           </div>
// // //           <div className="grid grid-cols-2 gap-x-6 gap-y-5">
// // //             <div className="col-span-2 flex flex-col gap-1.5">
// // //               <label htmlFor="title" className="text-[12.5px] font-medium text-gray-600">
// // //                 Title
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 id="title"
// // //                 placeholder="e.g. Q3 strategy review"
// // //                 value={title}
// // //                 onChange={(e) => setTitle(e.target.value)}
// // //                 required
// // //                 className={controlClass}
// // //               />
// // //             </div>

// // //             <div className="col-span-2 flex flex-col gap-1.5">
// // //               <label htmlFor="description" className="text-[12.5px] font-medium text-gray-600">
// // //                 Description <span className="font-normal italic text-gray-400">(optional)</span>
// // //               </label>
// // //               <textarea
// // //                 id="description"
// // //                 placeholder="What's this meeting about?"
// // //                 value={description}
// // //                 onChange={(e) => setDescription(e.target.value)}
// // //                 className={`${controlClass} min-h-[64px] resize-y`}
// // //               />
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <label htmlFor="organizer" className="text-[12.5px] font-medium text-gray-600">
// // //                 Organizer
// // //               </label>
// // //               <select
// // //                 id="organizer"
// // //                 value={organizerId}
// // //                 onChange={(e) => setOrganizerId(e.target.value)}
// // //                 required
// // //                 className={controlClass}
// // //               >
// // //                 <option value="" disabled>
// // //                   Select organizer
// // //                 </option>
// // //                 {employees.map((emp) => (
// // //                   <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// // //                     {emp.FIRST_NAME} {emp.LAST_NAME}
// // //                     {emp.JOB_TITLE ? ` — ${emp.JOB_TITLE}` : ""}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <label htmlFor="department" className="text-[12.5px] font-medium text-gray-600">
// // //                 Department
// // //               </label>
// // //               <select
// // //                 id="department"
// // //                 value={departmentId}
// // //                 onChange={(e) => setDepartmentId(e.target.value)}
// // //                 className={controlClass}
// // //               >
// // //                 <option value="" disabled>
// // //                   Select department
// // //                 </option>
// // //                 {departments.map((dep) => (
// // //                   <option key={dep.DEPARTMENT_ID} value={dep.DEPARTMENT_ID}>
// // //                     {dep.DEPARTMENT_NAME}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="col-span-2 flex flex-col gap-1.5">
// // //               <label className="text-[12.5px] font-medium text-gray-600">Meeting type</label>
// // //               <div className="flex gap-2">
// // //                 {[
// // //                   { value: "IN_PERSON", label: "In person" },
// // //                   { value: "VIRTUAL", label: "Virtual" },
// // //                   { value: "HYBRID", label: "Hybrid" },
// // //                 ].map((opt) => (
// // //                   <label key={opt.value} className="relative flex-1 cursor-pointer">
// // //                     <input
// // //                       type="radio"
// // //                       name="meetingType"
// // //                       value={opt.value}
// // //                       checked={meetingType === opt.value}
// // //                       onChange={() => setMeetingType(opt.value)}
// // //                       className="absolute inset-0 m-0 cursor-pointer opacity-0"
// // //                     />
// // //                     <span
// // //                       className={`block rounded-lg border px-2 py-2.5 text-center text-[13px] transition-colors ${
// // //                         meetingType === opt.value
// // //                           ? "border-amber-700 bg-amber-50 font-medium text-amber-800"
// // //                           : "border-gray-300 bg-white text-gray-600"
// // //                       }`}
// // //                     >
// // //                       {opt.label}
// // //                     </span>
// // //                   </label>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <label htmlFor="room" className="text-[12.5px] font-medium text-gray-600">
// // //                 Room <span className="font-normal italic text-gray-400">(optional)</span>
// // //               </label>
// // //               <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className={controlClass}>
// // //                 <option value="">Select room</option>
// // //                 {rooms.map((room) => (
// // //                   <option key={room.ROOM_ID} value={room.ROOM_ID}>
// // //                     {room.ROOM_NAME}
// // //                     {room.CAPACITY ? ` · ${room.CAPACITY} seats` : ""}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <label htmlFor="link" className="text-[12.5px] font-medium text-gray-600">
// // //                 Video link <span className="font-normal italic text-gray-400">(optional)</span>
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 id="link"
// // //                 placeholder="https://meet.company.com/..."
// // //                 value={virtualLink}
// // //                 onChange={(e) => setVirtualLink(e.target.value)}
// // //                 className={controlClass}
// // //               />
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <label htmlFor="date" className="text-[12.5px] font-medium text-gray-600">
// // //                 Date
// // //               </label>
// // //               <input
// // //                 type="date"
// // //                 id="date"
// // //                 value={date}
// // //                 onChange={(e) => setDate(e.target.value)}
// // //                 required
// // //                 className={controlClass}
// // //               />
// // //             </div>

// // //             <div className="flex flex-col gap-1.5">
// // //               <div className="flex gap-3">
// // //                 <div className="flex flex-1 flex-col gap-1.5">
// // //                   <label htmlFor="start" className="text-[12.5px] font-medium text-gray-600">
// // //                     Start time
// // //                   </label>
// // //                   <input
// // //                     type="time"
// // //                     id="start"
// // //                     value={start}
// // //                     onChange={(e) => setStart(e.target.value)}
// // //                     required
// // //                     className={controlClass}
// // //                   />
// // //                 </div>
// // //                 <div className="flex flex-1 flex-col gap-1.5">
// // //                   <label htmlFor="end" className="text-[12.5px] font-medium text-gray-600">
// // //                     End time
// // //                   </label>
// // //                   <input
// // //                     type="time"
// // //                     id="end"
// // //                     value={end}
// // //                     onChange={(e) => setEnd(e.target.value)}
// // //                     required
// // //                     className={controlClass}
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* PARTICIPANTS */}
// // //         <div className="border-b border-gray-200 px-11 py-8">
// // //           <div className="mb-5 flex items-baseline justify-between">
// // //             <div className="font-serif text-[19px] font-medium text-gray-900">Participants</div>
// // //             <div className="text-[12.5px] text-gray-400">{participants.length} invited</div>
// // //           </div>
// // //           <div className="flex flex-col gap-2.5">
// // //             {participants.map((row, idx) => (
// // //               <div
// // //                 key={idx}
// // //                 className="grid grid-cols-[2fr_1.4fr_1.2fr_32px] items-center gap-2.5 sm:grid-cols-[2fr_1.4fr_1.2fr_32px] max-sm:grid-cols-2"
// // //               >
// // //                 <select
// // //                   value={row.employeeId}
// // //                   onChange={(e) => updateParticipant(idx, { employeeId: e.target.value })}
// // //                   className={controlClass}
// // //                 >
// // //                   <option value="">Select employee</option>
// // //                   {employees.map((emp) => (
// // //                     <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// // //                       {emp.FIRST_NAME} {emp.LAST_NAME}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //                 <select
// // //                   value={row.role}
// // //                   onChange={(e) => updateParticipant(idx, { role: e.target.value })}
// // //                   className={controlClass}
// // //                 >
// // //                   <option value="ATTENDEE">Attendee</option>
// // //                   <option value="PRESENTER">Presenter</option>
// // //                   <option value="OPTIONAL">Optional</option>
// // //                 </select>
// // //                 <select
// // //                   value={row.rsvpStatus}
// // //                   onChange={(e) => updateParticipant(idx, { rsvpStatus: e.target.value })}
// // //                   className={controlClass}
// // //                 >
// // //                   <option value="PENDING">Pending</option>
// // //                   <option value="ACCEPTED">Accepted</option>
// // //                   <option value="DECLINED">Declined</option>
// // //                   <option value="TENTATIVE">Tentative</option>
// // //                 </select>
// // //                 <button
// // //                   type="button"
// // //                   aria-label="Remove participant"
// // //                   onClick={() => removeParticipantRow(idx)}
// // //                   className={iconBtnClass}
// // //                 >
// // //                   ×
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <button
// // //             type="button"
// // //             onClick={addParticipantRow}
// // //             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
// // //           >
// // //             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
// // //               +
// // //             </span>
// // //             Add participant
// // //           </button>
// // //         </div>

// // //         {/* AGENDA */}
// // //         <div className="px-11 py-8">
// // //           <div className="mb-5 flex items-baseline justify-between">
// // //             <div className="font-serif text-[19px] font-medium text-gray-900">Agenda</div>
// // //             <div className="text-[12.5px] text-gray-400">Ordered as it will be presented</div>
// // //           </div>
// // //           <div className="flex flex-col">
// // //             {agendaItems.map((item, idx) => (
// // //               <div
// // //                 key={idx}
// // //                 className="grid grid-cols-[28px_1fr_auto_1px_90px_32px] items-center gap-3.5 border-b border-dashed border-gray-200 py-3.5 first:pt-0 max-sm:grid-cols-[24px_1fr_32px] max-sm:gap-2"
// // //               >
// // //                 <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-amber-50 font-mono text-[13px] text-amber-800">
// // //                   {idx + 1}
// // //                 </div>
// // //                 <div className="flex min-w-0 flex-col gap-1.5">
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Topic"
// // //                     value={item.topic}
// // //                     onChange={(e) => updateAgendaItem(idx, { topic: e.target.value })}
// // //                     className="border-0 bg-transparent px-0 py-0.5 text-[14.5px] font-medium text-gray-900 focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
// // //                   />
// // //                   <select
// // //                     value={item.presenterId}
// // //                     onChange={(e) => updateAgendaItem(idx, { presenterId: e.target.value })}
// // //                     className="border-0 bg-transparent p-0 text-[12px] text-gray-400 focus:outline-none focus:ring-0"
// // //                   >
// // //                     <option value="">No presenter</option>
// // //                     {employees.map((emp) => (
// // //                       <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// // //                         Presenter: {emp.FIRST_NAME} {emp.LAST_NAME}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //                 <div className="mb-[11px] h-0 w-full min-w-6 self-end border-b border-dotted border-gray-300 max-sm:hidden" />
// // //                 <div className="max-sm:hidden" />
// // //                 <div className="flex items-center gap-1.5 font-mono text-[12.5px] text-gray-600 max-sm:col-start-2">
// // //                   <input
// // //                     type="number"
// // //                     min="0"
// // //                     value={item.durationMinutes}
// // //                     onChange={(e) => updateAgendaItem(idx, { durationMinutes: e.target.value })}
// // //                     className="w-11 border-0 bg-transparent p-0.5 text-right font-mono text-[12.5px] focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
// // //                   />
// // //                   min
// // //                 </div>
// // //                 <button
// // //                   type="button"
// // //                   aria-label="Remove agenda item"
// // //                   onClick={() => removeAgendaRow(idx)}
// // //                   className={iconBtnClass}
// // //                 >
// // //                   ×
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <button
// // //             type="button"
// // //             onClick={addAgendaRow}
// // //             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
// // //           >
// // //             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
// // //               +
// // //             </span>
// // //             Add agenda item
// // //           </button>
// // //           <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-3.5">
// // //             <span className="text-[12.5px] text-gray-400">Estimated total</span>
// // //             <span className="font-mono text-[15px] font-medium text-gray-900">{agendaTotal} min</span>
// // //           </div>
// // //         </div>
// // //       </form>

// // //       {/* FOOTER */}
// // //       <div className="flex flex-col items-stretch justify-between gap-4 border-t border-gray-200 bg-white px-11 py-7 sm:flex-row sm:items-center">
// // //         <div className="flex gap-2.5 sm:justify-end">
// // //           <Button
// // //             type="button"
// // //             onClick={() => navigate("/dashboard/agenda")}
           
// // //           >
// // //             Cancel
// // //           </Button>
// // //           <Button
// // //             type="button"
// // //             onClick={handleSaveDraft}
// // //             disabled={isSubmitting}>
           
// // //             Save as draft
// // //           </Button>
// // //           <Button
// // //             type="button"
// // //             onClick={handleSchedule}
// // //             disabled={isSubmitting}
            
// // //           >
// // //             {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Schedule meeting"}
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";

// // import { useDepartments, useEmployees, useMeetingRooms } from "./queries";
// // import { Button } from "@/components/ui/button";


// // // ─────────────────────────────────────────────────────────────────────────────
// // // Tailwind rewrite of the original agenda_sheet design (previously scoped CSS
// // // with custom CSS vars). Same look, same layout, same behavior — Tailwind
// // // utility classes, bg-white card surface. Minutes section added after Agenda,
// // // same add/remove-row pattern as participants and agenda items.
// // // ─────────────────────────────────────────────────────────────────────────────

// // const emptyParticipant = () => ({ employeeId: "", role: "ATTENDEE", rsvpStatus: "PENDING" });
// // const emptyAgendaItem = () => ({ topic: "", presenterId: "", durationMinutes: 15 });
// // const emptyMinute = () => ({ agendaItemIndex: "", authorId: "", notes: "" });

// // // Splits an ISO-like "YYYY-MM-DDTHH:MM:SS" string into { date, time }
// // const splitDateTime = (isoLike) => {
// //   if (!isoLike) return { date: "", time: "" };
// //   const [date, timePart] = isoLike.split("T");
// //   const time = timePart ? timePart.slice(0, 5) : "";
// //   return { date, time };
// // };

// // // Shared field control classes (input/select/textarea)
// // const controlClass =
// //   "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14.5px] text-gray-900 " +
// //   "transition-colors placeholder:text-gray-400 focus:outline-none focus:border-amber-700 " +
// //   "focus:ring-2 focus:ring-amber-100";

// // const iconBtnClass =
// //   "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white " +
// //   "text-gray-400 text-base leading-none transition-colors hover:border-red-400 hover:text-red-500 hover:bg-red-50";

// // export default function AgendaForm({ mode = "add", initialData = null, onSubmit, isSubmitting }) {
// //   const navigate = useNavigate();


// //   const { data: departments = [] } = useDepartments();
// //   const { data: employees = [] } = useEmployees();
// //   const { data: rooms = [] } = useMeetingRooms();

// //   const [title, setTitle] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [organizerId, setOrganizerId] = useState("");
// //   const [departmentId, setDepartmentId] = useState("");
// //   const [meetingType, setMeetingType] = useState("IN_PERSON");
// //   const [roomId, setRoomId] = useState("");
// //   const [virtualLink, setVirtualLink] = useState("");
// //   const [date, setDate] = useState("");
// //   const [start, setStart] = useState("");
// //   const [end, setEnd] = useState("");
// //   const [participants, setParticipants] = useState([emptyParticipant()]);
// //   const [agendaItems, setAgendaItems] = useState([emptyAgendaItem()]);
// //   const [minutes, setMinutes] = useState([emptyMinute()]);

// //   // Prefill on edit
// //  useEffect(() => {
// //   if (!initialData) return;

// //   // API response wraps the real payload under `.data` — unwrap it if present.
// //   const meeting = initialData.data ?? initialData;

// //   setTitle(meeting.TITLE || "");
// //   setDescription(meeting.DESCRIPTION || "");
// //   setOrganizerId(meeting.ORGANIZER_ID ? String(meeting.ORGANIZER_ID) : "");
// //   setDepartmentId(meeting.DEPARTMENT_ID ? String(meeting.DEPARTMENT_ID) : "");
// //   setMeetingType(meeting.MEETING_TYPE || "IN_PERSON");
// //   setRoomId(meeting.ROOM_ID ? String(meeting.ROOM_ID) : "");
// //   setVirtualLink(meeting.VIRTUAL_LINK || "");

// //   const { date: d, time: st } = splitDateTime(meeting.START_TIME);
// //   const { time: et } = splitDateTime(meeting.END_TIME);
// //   setDate(d);
// //   setStart(st);
// //   setEnd(et);

// //   if (Array.isArray(meeting.participants) && meeting.participants.length > 0) {
// //     setParticipants(
// //       meeting.participants.map((p) => ({
// //         employeeId: String(p.EMPLOYEE_ID),
// //         role: p.ROLE || "ATTENDEE",
// //         rsvpStatus: p.RSVP_STATUS || "PENDING",
// //       }))
// //     );
// //   }

// //   const loadedAgendaItems = Array.isArray(meeting.agendaItems) ? meeting.agendaItems : [];
// //   if (loadedAgendaItems.length > 0) {
// //     setAgendaItems(
// //       loadedAgendaItems.map((a) => ({
// //         topic: a.TOPIC || "",
// //         presenterId: a.PRESENTER_ID ? String(a.PRESENTER_ID) : "",
// //         durationMinutes: a.DURATION_MINUTES ?? 15,
// //       }))
// //     );
// //   }

// //   if (Array.isArray(meeting.minutes) && meeting.minutes.length > 0) {
// //     setMinutes(
// //       meeting.minutes.map((m) => ({
// //         agendaItemIndex: m.AGENDA_ITEM_ID
// //           ? String(loadedAgendaItems.findIndex((a) => a.AGENDA_ITEM_ID === m.AGENDA_ITEM_ID))
// //           : "",
// //         authorId: m.AUTHOR_ID ? String(m.AUTHOR_ID) : "",
// //         notes: m.NOTES || "",
// //       }))
// //     );
// //   }
// // }, [initialData]);

// //   const agendaTotal = useMemo(
// //     () => agendaItems.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
// //     [agendaItems]
// //   );

// //   const updateParticipant = (idx, patch) =>
// //     setParticipants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

// //   const addParticipantRow = () => setParticipants((rows) => [...rows, emptyParticipant()]);

// //   const removeParticipantRow = (idx) =>
// //     setParticipants((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

// //   const updateAgendaItem = (idx, patch) =>
// //     setAgendaItems((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

// //   const addAgendaRow = () => setAgendaItems((rows) => [...rows, emptyAgendaItem()]);

// //   const removeAgendaRow = (idx) =>
// //     setAgendaItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

// //   const updateMinute = (idx, patch) =>
// //     setMinutes((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

// //  const addMinuteRow = () =>
// //   setMinutes((rows) => [...rows, emptyMinute()]);

// //   const removeMinuteRow = (idx) =>
// //     setMinutes((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

// //   const buildPayload = (status) => {
// //     if (!title.trim()) {
// //       toast.error("Title is required.");
// //       return null;
// //     }
// //     if (!organizerId) {
// //       toast.error("Organizer is required.");
// //       return null;
// //     }
// //     if (!date || !start || !end) {
// //       toast.error("Date, start time, and end time are required.");
// //       return null;
// //     }

// //     const startDateTime = new Date(`${date}T${start}`);
// //     const endDateTime = new Date(`${date}T${end}`);

// //     if (endDateTime <= startDateTime) {
// //       toast.error("End time must be after start time.");
// //       return null;
// //     }

// //     return {
// //       title: title.trim(),
// //       description: description.trim() || null,
// //       organizerId: Number(organizerId),
// //       departmentId: departmentId ? Number(departmentId) : null,
// //       roomId: roomId ? Number(roomId) : null,
// //       meetingType,
// //       virtualLink: virtualLink.trim() || null,
// //       startTime: startDateTime,
// //       endTime: endDateTime,
// //       status,
// //       participants: participants
// //         .filter((p) => p.employeeId)
// //         .map((p) => ({
// //           employeeId: Number(p.employeeId),
// //           role: p.role,
// //           rsvpStatus: p.rsvpStatus,
// //         })),
// //       agendaItems: agendaItems
// //         .filter((a) => a.topic.trim())
// //         .map((a, idx) => ({
// //           itemOrder: idx + 1,
// //           topic: a.topic.trim(),
// //           presenterId: a.presenterId ? Number(a.presenterId) : null,
// //           durationMinutes: a.durationMinutes ? Number(a.durationMinutes) : null,
// //         })),
// //       // agendaItemIndex refers to the position in the agendaItems array above —
// //       // the backend resolves it to the real AGENDA_ITEM_ID after inserting agenda
// //       // items, since brand-new items don't have a real ID yet at submit time.
// //       minutes: minutes
// //         .filter((m) => m.notes.trim())
// //         .map((m) => ({
// //           agendaItemIndex: m.agendaItemIndex !== "" ? Number(m.agendaItemIndex) : null,
// //           authorId: m.authorId ? Number(m.authorId) : null,
// //           notes: m.notes.trim(),
// //         })),
// //     };
// //   };

// //   const handleSaveDraft = () => {
// //     const payload = buildPayload("DRAFT");
// //     if (payload) onSubmit(payload);
// //   };

// //   const handleSchedule = (e) => {
// //     e.preventDefault();
// //     const payload = buildPayload("SCHEDULED");
// //     if (payload) onSubmit(payload);
// //   };

// //   return (
// //     <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// //       <form onSubmit={handleSchedule}>
// //         {/* MEETING DETAILS */}
// //         <div className="border-b border-gray-200 px-11 py-8">
// //           <div className="mb-5 flex items-baseline justify-between">
// //             <div className="font-serif text-[19px] font-medium text-gray-900">Meeting Details</div>
// //           </div>
// //           <div className="grid grid-cols-2 gap-x-6 gap-y-5">
// //             <div className="col-span-2 flex flex-col gap-1.5">
// //               <label htmlFor="title" className="text-[12.5px] font-medium text-gray-600">
// //                 Title
// //               </label>
// //               <input
// //                 type="text"
// //                 id="title"
// //                 placeholder="e.g. Q3 strategy review"
// //                 value={title}
// //                 onChange={(e) => setTitle(e.target.value)}
// //                 required
// //                 className={controlClass}
// //               />
// //             </div>

// //             <div className="col-span-2 flex flex-col gap-1.5">
// //               <label htmlFor="description" className="text-[12.5px] font-medium text-gray-600">
// //                 Description <span className="font-normal italic text-gray-400">(optional)</span>
// //               </label>
// //               <textarea
// //                 id="description"
// //                 placeholder="What's this meeting about?"
// //                 value={description}
// //                 onChange={(e) => setDescription(e.target.value)}
// //                 className={`${controlClass} min-h-[64px] resize-y`}
// //               />
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <label htmlFor="organizer" className="text-[12.5px] font-medium text-gray-600">
// //                 Organizer
// //               </label>
// //               <select
// //                 id="organizer"
// //                 value={organizerId}
// //                 onChange={(e) => setOrganizerId(e.target.value)}
// //                 required
// //                 className={controlClass}
// //               >
// //                 <option value="" disabled>
// //                   Select organizer
// //                 </option>
// //                 {employees.map((emp) => (
// //                   <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// //                     {emp.FIRST_NAME} {emp.LAST_NAME}
// //                     {emp.JOB_TITLE ? ` — ${emp.JOB_TITLE}` : ""}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <label htmlFor="department" className="text-[12.5px] font-medium text-gray-600">
// //                 Department
// //               </label>
// //               <select
// //                 id="department"
// //                 value={departmentId}
// //                 onChange={(e) => setDepartmentId(e.target.value)}
// //                 className={controlClass}
// //               >
// //                 <option value="" disabled>
// //                   Select department
// //                 </option>
// //                 {departments.map((dep) => (
// //                   <option key={dep.DEPARTMENT_ID} value={dep.DEPARTMENT_ID}>
// //                     {dep.DEPARTMENT_NAME}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="col-span-2 flex flex-col gap-1.5">
// //               <label className="text-[12.5px] font-medium text-gray-600">Meeting type</label>
// //               <div className="flex gap-2">
// //                 {[
// //                   { value: "IN_PERSON", label: "In person" },
// //                   { value: "VIRTUAL", label: "Virtual" },
// //                   { value: "HYBRID", label: "Hybrid" },
// //                 ].map((opt) => (
// //                   <label key={opt.value} className="relative flex-1 cursor-pointer">
// //                     <input
// //                       type="radio"
// //                       name="meetingType"
// //                       value={opt.value}
// //                       checked={meetingType === opt.value}
// //                       onChange={() => setMeetingType(opt.value)}
// //                       className="absolute inset-0 m-0 cursor-pointer opacity-0"
// //                     />
// //                     <span
// //                       className={`block rounded-lg border px-2 py-2.5 text-center text-[13px] transition-colors ${
// //                         meetingType === opt.value
// //                           ? "border-amber-700 bg-amber-50 font-medium text-amber-800"
// //                           : "border-gray-300 bg-white text-gray-600"
// //                       }`}
// //                     >
// //                       {opt.label}
// //                     </span>
// //                   </label>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <label htmlFor="room" className="text-[12.5px] font-medium text-gray-600">
// //                 Room <span className="font-normal italic text-gray-400">(optional)</span>
// //               </label>
// //               <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className={controlClass}>
// //                 <option value="">Select room</option>
// //                 {rooms.map((room) => (
// //                   <option key={room.ROOM_ID} value={room.ROOM_ID}>
// //                     {room.ROOM_NAME}
// //                     {room.CAPACITY ? ` · ${room.CAPACITY} seats` : ""}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <label htmlFor="link" className="text-[12.5px] font-medium text-gray-600">
// //                 Video link <span className="font-normal italic text-gray-400">(optional)</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 id="link"
// //                 placeholder="https://meet.company.com/..."
// //                 value={virtualLink}
// //                 onChange={(e) => setVirtualLink(e.target.value)}
// //                 className={controlClass}
// //               />
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <label htmlFor="date" className="text-[12.5px] font-medium text-gray-600">
// //                 Date
// //               </label>
// //               <input
// //                 type="date"
// //                 id="date"
// //                 value={date}
// //                 onChange={(e) => setDate(e.target.value)}
// //                 required
// //                 className={controlClass}
// //               />
// //             </div>

// //             <div className="flex flex-col gap-1.5">
// //               <div className="flex gap-3">
// //                 <div className="flex flex-1 flex-col gap-1.5">
// //                   <label htmlFor="start" className="text-[12.5px] font-medium text-gray-600">
// //                     Start time
// //                   </label>
// //                   <input
// //                     type="time"
// //                     id="start"
// //                     value={start}
// //                     onChange={(e) => setStart(e.target.value)}
// //                     required
// //                     className={controlClass}
// //                   />
// //                 </div>
// //                 <div className="flex flex-1 flex-col gap-1.5">
// //                   <label htmlFor="end" className="text-[12.5px] font-medium text-gray-600">
// //                     End time
// //                   </label>
// //                   <input
// //                     type="time"
// //                     id="end"
// //                     value={end}
// //                     onChange={(e) => setEnd(e.target.value)}
// //                     required
// //                     className={controlClass}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* PARTICIPANTS */}
// //         <div className="border-b border-gray-200 px-11 py-8">
// //           <div className="mb-5 flex items-baseline justify-between">
// //             <div className="font-serif text-[19px] font-medium text-gray-900">Participants</div>
// //             <div className="text-[12.5px] text-gray-400">{participants.length} invited</div>
// //           </div>
// //           <div className="flex flex-col gap-2.5">
// //             {participants.map((row, idx) => (
// //               <div
// //                 key={idx}
// //                 className="grid grid-cols-[2fr_1.4fr_1.2fr_32px] items-center gap-2.5 sm:grid-cols-[2fr_1.4fr_1.2fr_32px] max-sm:grid-cols-2"
// //               >
// //                 <select
// //                   value={row.employeeId}
// //                   onChange={(e) => updateParticipant(idx, { employeeId: e.target.value })}
// //                   className={controlClass}
// //                 >
// //                   <option value="">Select employee</option>
// //                   {employees.map((emp) => (
// //                     <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// //                       {emp.FIRST_NAME} {emp.LAST_NAME}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <select
// //                   value={row.role}
// //                   onChange={(e) => updateParticipant(idx, { role: e.target.value })}
// //                   className={controlClass}
// //                 >
// //                   <option value="ATTENDEE">Attendee</option>
// //                   <option value="PRESENTER">Presenter</option>
// //                   <option value="OPTIONAL">Optional</option>
// //                 </select>
// //                 <select
// //                   value={row.rsvpStatus}
// //                   onChange={(e) => updateParticipant(idx, { rsvpStatus: e.target.value })}
// //                   className={controlClass}
// //                 >
// //                   <option value="PENDING">Pending</option>
// //                   <option value="ACCEPTED">Accepted</option>
// //                   <option value="DECLINED">Declined</option>
// //                   <option value="TENTATIVE">Tentative</option>
// //                 </select>
// //                 <button
// //                   type="button"
// //                   aria-label="Remove participant"
// //                   onClick={() => removeParticipantRow(idx)}
// //                   className={iconBtnClass}
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //           <button
// //             type="button"
// //             onClick={addParticipantRow}
// //             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
// //           >
// //             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
// //               +
// //             </span>
// //             Add participant
// //           </button>
// //         </div>

// //         {/* AGENDA */}
// //         <div className="border-b border-gray-200 px-11 py-8">
// //           <div className="mb-5 flex items-baseline justify-between">
// //             <div className="font-serif text-[19px] font-medium text-gray-900">Agenda</div>
// //             <div className="text-[12.5px] text-gray-400">Ordered as it will be presented</div>
// //           </div>
// //           <div className="flex flex-col">
// //             {agendaItems.map((item, idx) => (
// //               <div
// //                 key={idx}
// //                 className="grid grid-cols-[28px_1fr_auto_1px_90px_32px] items-center gap-3.5 border-b border-dashed border-gray-200 py-3.5 first:pt-0 max-sm:grid-cols-[24px_1fr_32px] max-sm:gap-2"
// //               >
// //                 <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-amber-50 font-mono text-[13px] text-amber-800">
// //                   {idx + 1}
// //                 </div>
// //                 <div className="flex min-w-0 flex-col gap-1.5">
// //                   <input
// //                     type="text"
// //                     placeholder="Topic"
// //                     value={item.topic}
// //                     onChange={(e) => updateAgendaItem(idx, { topic: e.target.value })}
// //                     className="border-0 bg-transparent px-0 py-0.5 text-[14.5px] font-medium text-gray-900 focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
// //                   />
// //                   <select
// //                     value={item.presenterId}
// //                     onChange={(e) => updateAgendaItem(idx, { presenterId: e.target.value })}
// //                     className="border-0 bg-transparent p-0 text-[12px] text-gray-400 focus:outline-none focus:ring-0"
// //                   >
// //                     <option value="">No presenter</option>
// //                     {employees.map((emp) => (
// //                       <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// //                         Presenter: {emp.FIRST_NAME} {emp.LAST_NAME}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div className="mb-[11px] h-0 w-full min-w-6 self-end border-b border-dotted border-gray-300 max-sm:hidden" />
// //                 <div className="max-sm:hidden" />
// //                 <div className="flex items-center gap-1.5 font-mono text-[12.5px] text-gray-600 max-sm:col-start-2">
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     value={item.durationMinutes}
// //                     onChange={(e) => updateAgendaItem(idx, { durationMinutes: e.target.value })}
// //                     className="w-11 border-0 bg-transparent p-0.5 text-right font-mono text-[12.5px] focus:border-b focus:border-amber-700 focus:outline-none focus:ring-0"
// //                   />
// //                   min
// //                 </div>
// //                 <button
// //                   type="button"
// //                   aria-label="Remove agenda item"
// //                   onClick={() => removeAgendaRow(idx)}
// //                   className={iconBtnClass}
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //           <button
// //             type="button"
// //             onClick={addAgendaRow}
// //             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
// //           >
// //             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
// //               +
// //             </span>
// //             Add agenda item
// //           </button>
// //           <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-3.5">
// //             <span className="text-[12.5px] text-gray-400">Estimated total</span>
// //             <span className="font-mono text-[15px] font-medium text-gray-900">{agendaTotal} min</span>
// //           </div>
// //         </div>

// //         {/* MINUTES */}
// //         <div className="px-11 py-8">
// //           <div className="mb-5 flex items-baseline justify-between">
// //             <div className="font-serif text-[19px] font-medium text-gray-900">Meeting Minutes</div>
// //             <div className="text-[12.5px] text-gray-400">Optional</div>
// //           </div>
// //           <div className="flex flex-col gap-2.5">
// //             {minutes.map((row, idx) => (
// //               <div
// //                 key={idx}
// //                 className="grid grid-cols-[1.4fr_1.2fr_2fr_32px] items-center gap-2.5 max-sm:grid-cols-2"
// //               >
// //                <select
// //   value={row.agendaItemIndex}
// //   onChange={(e) => updateMinute(idx, { agendaItemIndex: e.target.value })}
// //   className={controlClass}
// // >
// //   <option value="">(General)</option>
// //   {agendaItems.map((a, i) => (
// //     <option key={i} value={i}>
// //       {a.topic || `Item ${i + 1}`}
// //     </option>
// //   ))}
// // </select>
// //                 <select
// //                   value={row.authorId}
// //                   onChange={(e) => updateMinute(idx, { authorId: e.target.value })}
// //                   className={controlClass}
// //                 >
// //                   <option value="">Select author</option>
// //                   {employees.map((emp) => (
// //                     <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
// //                       {emp.FIRST_NAME} {emp.LAST_NAME}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <input
// //                   type="text"
// //                   placeholder="Notes"
// //                   value={row.notes}
// //                   onChange={(e) => updateMinute(idx, { notes: e.target.value })}
// //                   className={controlClass}
// //                 />
// //                 <button
// //                   type="button"
// //                   aria-label="Remove minute"
// //                   onClick={() => removeMinuteRow(idx)}
// //                   className={iconBtnClass}
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //           <button
// //             type="button"
// //             onClick={addMinuteRow}
// //             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
// //           >
// //             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[13px]">
// //               +
// //             </span>
// //             Add Minute
// //           </button>
// //         </div>
// //       </form>

// //       {/* FOOTER */}
// //       <div className="flex flex-col items-stretch justify-between gap-4 border-t border-gray-200 bg-white px-11 py-7 sm:flex-row sm:items-center">
// //         <div className="flex gap-2.5 sm:justify-end">
// //           <Button type="button" onClick={() => navigate("/dashboard/agenda")}>
// //             Cancel
// //           </Button>
// //           <Button type="button" onClick={handleSaveDraft} disabled={isSubmitting}>
// //             Save as draft
// //           </Button>
// //           <Button type="button" onClick={handleSchedule} disabled={isSubmitting}>
// //             {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Schedule meeting"}
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { useDepartments, useEmployees, useMeetingRooms } from "./queries";
// import { Button } from "@/components/ui/button";
// import {
//   CalendarDays,
//   Users,
//   ListChecks,
//   FileText,
//   Plus,
//   X,
//   Clock,
//   MapPin,
//   Video,
//   ArrowLeft,
// } from "lucide-react";

// // ─────────────────────────────────────────────────────────────────────────────
// // Professional redesign — same state, same validation, same payload shape.
// // Only markup/classNames changed: section header badges, card-style rows for
// // agenda/minutes, refined controls, sticky footer.
// // ─────────────────────────────────────────────────────────────────────────────

// const emptyParticipant = () => ({ employeeId: "", role: "ATTENDEE", rsvpStatus: "PENDING" });
// const emptyAgendaItem = () => ({ topic: "", presenterId: "", durationMinutes: 15 });
// const emptyMinute = () => ({ agendaItemIndex: "", authorId: "", notes: "" });

// // Splits an ISO-like "YYYY-MM-DDTHH:MM:SS" string into { date, time }
// const splitDateTime = (isoLike) => {
//   if (!isoLike) return { date: "", time: "" };
//   const [date, timePart] = isoLike.split("T");
//   const time = timePart ? timePart.slice(0, 5) : "";
//   return { date, time };
// };

// // Shared field control classes (input/select/textarea)
// const controlClass =
//   "w-full rounded-lg border border-gray-300 bg-gray-50/60 px-3 py-2.5 text-[14.5px] text-gray-900 " +
//   "transition-colors placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-amber-600 " +
//   "focus:ring-2 focus:ring-amber-100";

// const iconBtnClass =
//   "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white " +
//   "text-gray-400 transition-colors hover:border-red-300 hover:text-red-500 hover:bg-red-50";

// const sectionLabelClass = "text-[12.5px] font-semibold uppercase tracking-wide text-gray-500";

// function SectionHeader({ icon: Icon, title, meta }) {
//   return (
//     <div className="mb-6 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50">
//           <Icon className="h-4.5 w-4.5 text-amber-700" strokeWidth={2} />
//         </div>
//         <div className="font-serif text-[19px] font-medium text-gray-900">{title}</div>
//       </div>
//       {meta && <div className="text-[12.5px] text-gray-400">{meta}</div>}
//     </div>
//   );
// }

// export default function AgendaForm({ mode = "add", initialData = null, onSubmit, isSubmitting }) {
//   const navigate = useNavigate();

//   const { data: departments = [] } = useDepartments();
//   const { data: employees = [] } = useEmployees();
//   const { data: rooms = [] } = useMeetingRooms();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [organizerId, setOrganizerId] = useState("");
//   const [departmentId, setDepartmentId] = useState("");
//   const [meetingType, setMeetingType] = useState("IN_PERSON");
//   const [roomId, setRoomId] = useState("");
//   const [virtualLink, setVirtualLink] = useState("");
//   const [date, setDate] = useState("");
//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");
//   const [participants, setParticipants] = useState([emptyParticipant()]);
//   const [agendaItems, setAgendaItems] = useState([emptyAgendaItem()]);
//   const [minutes, setMinutes] = useState([emptyMinute()]);

//   // Prefill on edit
//   useEffect(() => {
//     if (!initialData) return;

//     // API response wraps the real payload under `.data` — unwrap it if present.
//     const meeting = initialData.data ?? initialData;

//     setTitle(meeting.TITLE || "");
//     setDescription(meeting.DESCRIPTION || "");
//     setOrganizerId(meeting.ORGANIZER_ID ? String(meeting.ORGANIZER_ID) : "");
//     setDepartmentId(meeting.DEPARTMENT_ID ? String(meeting.DEPARTMENT_ID) : "");
//     setMeetingType(meeting.MEETING_TYPE || "IN_PERSON");
//     setRoomId(meeting.ROOM_ID ? String(meeting.ROOM_ID) : "");
//     setVirtualLink(meeting.VIRTUAL_LINK || "");

//     const { date: d, time: st } = splitDateTime(meeting.START_TIME);
//     const { time: et } = splitDateTime(meeting.END_TIME);
//     setDate(d);
//     setStart(st);
//     setEnd(et);

//     if (Array.isArray(meeting.participants) && meeting.participants.length > 0) {
//       setParticipants(
//         meeting.participants.map((p) => ({
//           employeeId: String(p.EMPLOYEE_ID),
//           role: p.ROLE || "ATTENDEE",
//           rsvpStatus: p.RSVP_STATUS || "PENDING",
//         }))
//       );
//     }

//     const loadedAgendaItems = Array.isArray(meeting.agendaItems) ? meeting.agendaItems : [];
//     if (loadedAgendaItems.length > 0) {
//       setAgendaItems(
//         loadedAgendaItems.map((a) => ({
//           topic: a.TOPIC || "",
//           presenterId: a.PRESENTER_ID ? String(a.PRESENTER_ID) : "",
//           durationMinutes: a.DURATION_MINUTES ?? 15,
//         }))
//       );
//     }

//     if (Array.isArray(meeting.minutes) && meeting.minutes.length > 0) {
//       setMinutes(
//         meeting.minutes.map((m) => ({
//           agendaItemIndex: m.AGENDA_ITEM_ID
//             ? String(loadedAgendaItems.findIndex((a) => a.AGENDA_ITEM_ID === m.AGENDA_ITEM_ID))
//             : "",
//           authorId: m.AUTHOR_ID ? String(m.AUTHOR_ID) : "",
//           notes: m.NOTES || "",
//         }))
//       );
//     }
//   }, [initialData]);

//   const agendaTotal = useMemo(
//     () => agendaItems.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
//     [agendaItems]
//   );

//   const updateParticipant = (idx, patch) =>
//     setParticipants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

//   const addParticipantRow = () => setParticipants((rows) => [...rows, emptyParticipant()]);

//   const removeParticipantRow = (idx) =>
//     setParticipants((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

//   const updateAgendaItem = (idx, patch) =>
//     setAgendaItems((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

//   const addAgendaRow = () => setAgendaItems((rows) => [...rows, emptyAgendaItem()]);

//   const removeAgendaRow = (idx) =>
//     setAgendaItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

//   const updateMinute = (idx, patch) =>
//     setMinutes((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

//   const addMinuteRow = () => setMinutes((rows) => [...rows, emptyMinute()]);

//   const removeMinuteRow = (idx) =>
//     setMinutes((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

//   const buildPayload = (status) => {
//     if (!title.trim()) {
//       toast.error("Title is required.");
//       return null;
//     }
//     if (!organizerId) {
//       toast.error("Organizer is required.");
//       return null;
//     }
//     if (!date || !start || !end) {
//       toast.error("Date, start time, and end time are required.");
//       return null;
//     }

//     const startDateTime = new Date(`${date}T${start}`);
//     const endDateTime = new Date(`${date}T${end}`);

//     if (endDateTime <= startDateTime) {
//       toast.error("End time must be after start time.");
//       return null;
//     }

//     return {
//       title: title.trim(),
//       description: description.trim() || null,
//       organizerId: Number(organizerId),
//       departmentId: departmentId ? Number(departmentId) : null,
//       roomId: roomId ? Number(roomId) : null,
//       meetingType,
//       virtualLink: virtualLink.trim() || null,
//       startTime: startDateTime,
//       endTime: endDateTime,
//       status,
//       participants: participants
//         .filter((p) => p.employeeId)
//         .map((p) => ({
//           employeeId: Number(p.employeeId),
//           role: p.role,
//           rsvpStatus: p.rsvpStatus,
//         })),
//       agendaItems: agendaItems
//         .filter((a) => a.topic.trim())
//         .map((a, idx) => ({
//           itemOrder: idx + 1,
//           topic: a.topic.trim(),
//           presenterId: a.presenterId ? Number(a.presenterId) : null,
//           durationMinutes: a.durationMinutes ? Number(a.durationMinutes) : null,
//         })),
//       // agendaItemIndex refers to the position in the agendaItems array above —
//       // the backend resolves it to the real AGENDA_ITEM_ID after inserting agenda
//       // items, since brand-new items don't have a real ID yet at submit time.
//       minutes: minutes
//         .filter((m) => m.notes.trim())
//         .map((m) => ({
//           agendaItemIndex: m.agendaItemIndex !== "" ? Number(m.agendaItemIndex) : null,
//           authorId: m.authorId ? Number(m.authorId) : null,
//           notes: m.notes.trim(),
//         })),
//     };
//   };

//   const handleSaveDraft = () => {
//     const payload = buildPayload("DRAFT");
//     if (payload) onSubmit(payload);
//   };

//   const handleSchedule = (e) => {
//     e.preventDefault();
//     const payload = buildPayload("SCHEDULED");
//     if (payload) onSubmit(payload);
//   };

//   return (
//     <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//       {/* PAGE HEADER */}
//       <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-br from-amber-50/60 via-white to-white px-11 py-6">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => navigate("/dashboard/agenda")}
//             className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
//             aria-label="Back to agenda list"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </button>
//           <div>
//             <h1 className="font-serif text-[22px] font-semibold text-gray-900">
//               {mode === "edit" ? "Edit Meeting" : "Schedule a Meeting"}
//             </h1>
//             <p className="text-[13px] text-gray-500">
//               {mode === "edit"
//                 ? "Update the details, agenda, and participants."
//                 : "Set up meeting details, invite participants, and build the agenda."}
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSchedule}>
//         {/* MEETING DETAILS */}
//         <div className="border-b border-gray-200 px-11 py-8">
//           <SectionHeader icon={CalendarDays} title="Meeting Details" />
//           <div className="grid grid-cols-2 gap-x-6 gap-y-5">
//             <div className="col-span-2 flex flex-col gap-1.5">
//               <label htmlFor="title" className={sectionLabelClass}>
//                 Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 placeholder="e.g. Q3 strategy review"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//                 className={`${controlClass} text-[15px] font-medium`}
//               />
//             </div>

//             <div className="col-span-2 flex flex-col gap-1.5">
//               <label htmlFor="description" className={sectionLabelClass}>
//                 Description <span className="font-normal italic normal-case text-gray-400">(optional)</span>
//               </label>
//               <textarea
//                 id="description"
//                 placeholder="What's this meeting about?"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className={`${controlClass} min-h-[64px] resize-y`}
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label htmlFor="organizer" className={sectionLabelClass}>
//                 Organizer
//               </label>
//               <select
//                 id="organizer"
//                 value={organizerId}
//                 onChange={(e) => setOrganizerId(e.target.value)}
//                 required
//                 className={controlClass}
//               >
//                 <option value="" disabled>
//                   Select organizer
//                 </option>
//                 {employees.map((emp) => (
//                   <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
//                     {emp.FIRST_NAME} {emp.LAST_NAME}
//                     {emp.JOB_TITLE ? ` — ${emp.JOB_TITLE}` : ""}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label htmlFor="department" className={sectionLabelClass}>
//                 Department
//               </label>
//               <select
//                 id="department"
//                 value={departmentId}
//                 onChange={(e) => setDepartmentId(e.target.value)}
//                 className={controlClass}
//               >
//                 <option value="" disabled>
//                   Select department
//                 </option>
//                 {departments.map((dep) => (
//                   <option key={dep.DEPARTMENT_ID} value={dep.DEPARTMENT_ID}>
//                     {dep.DEPARTMENT_NAME}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-span-2 flex flex-col gap-1.5">
//               <label className={sectionLabelClass}>Meeting type</label>
//               <div className="flex gap-2">
//                 {[
//                   { value: "IN_PERSON", label: "In person" },
//                   { value: "VIRTUAL", label: "Virtual" },
//                   { value: "HYBRID", label: "Hybrid" },
//                 ].map((opt) => (
//                   <label key={opt.value} className="relative flex-1 cursor-pointer">
//                     <input
//                       type="radio"
//                       name="meetingType"
//                       value={opt.value}
//                       checked={meetingType === opt.value}
//                       onChange={() => setMeetingType(opt.value)}
//                       className="absolute inset-0 m-0 cursor-pointer opacity-0"
//                     />
//                     <span
//                       className={`block rounded-lg border px-2 py-2.5 text-center text-[13px] font-medium transition-all ${
//                         meetingType === opt.value
//                           ? "border-amber-600 bg-amber-50 text-amber-800 shadow-sm ring-1 ring-amber-200"
//                           : "border-gray-200 bg-gray-50/60 text-gray-500 hover:border-gray-300"
//                       }`}
//                     >
//                       {opt.label}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label htmlFor="room" className={`${sectionLabelClass} flex items-center gap-1.5`}>
//                 <MapPin className="h-3 w-3" />
//                 Room <span className="font-normal italic normal-case text-gray-400">(optional)</span>
//               </label>
//               <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className={controlClass}>
//                 <option value="">Select room</option>
//                 {rooms.map((room) => (
//                   <option key={room.ROOM_ID} value={room.ROOM_ID}>
//                     {room.ROOM_NAME}
//                     {room.CAPACITY ? ` · ${room.CAPACITY} seats` : ""}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label htmlFor="link" className={`${sectionLabelClass} flex items-center gap-1.5`}>
//                 <Video className="h-3 w-3" />
//                 Video link <span className="font-normal italic normal-case text-gray-400">(optional)</span>
//               </label>
//               <input
//                 type="text"
//                 id="link"
//                 placeholder="https://meet.company.com/..."
//                 value={virtualLink}
//                 onChange={(e) => setVirtualLink(e.target.value)}
//                 className={controlClass}
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label htmlFor="date" className={sectionLabelClass}>
//                 Date
//               </label>
//               <input
//                 type="date"
//                 id="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 required
//                 className={controlClass}
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <div className="flex gap-3">
//                 <div className="flex flex-1 flex-col gap-1.5">
//                   <label htmlFor="start" className={`${sectionLabelClass} flex items-center gap-1.5`}>
//                     <Clock className="h-3 w-3" />
//                     Start time
//                   </label>
//                   <input
//                     type="time"
//                     id="start"
//                     value={start}
//                     onChange={(e) => setStart(e.target.value)}
//                     required
//                     className={controlClass}
//                   />
//                 </div>
//                 <div className="flex flex-1 flex-col gap-1.5">
//                   <label htmlFor="end" className={`${sectionLabelClass} flex items-center gap-1.5`}>
//                     <Clock className="h-3 w-3" />
//                     End time
//                   </label>
//                   <input
//                     type="time"
//                     id="end"
//                     value={end}
//                     onChange={(e) => setEnd(e.target.value)}
//                     required
//                     className={controlClass}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PARTICIPANTS */}
//         <div className="border-b border-gray-200 px-11 py-8">
//           <SectionHeader icon={Users} title="Participants" meta={`${participants.length} invited`} />
//           <div className="flex flex-col gap-2.5">
//             {participants.map((row, idx) => (
//               <div
//                 key={idx}
//                 className="grid grid-cols-[2fr_1.4fr_1.2fr_32px] items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/40 p-2.5 sm:grid-cols-[2fr_1.4fr_1.2fr_32px] max-sm:grid-cols-2"
//               >
//                 <select
//                   value={row.employeeId}
//                   onChange={(e) => updateParticipant(idx, { employeeId: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 >
//                   <option value="">Select employee</option>
//                   {employees.map((emp) => (
//                     <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
//                       {emp.FIRST_NAME} {emp.LAST_NAME}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={row.role}
//                   onChange={(e) => updateParticipant(idx, { role: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 >
//                   <option value="ATTENDEE">Attendee</option>
//                   <option value="PRESENTER">Presenter</option>
//                   <option value="OPTIONAL">Optional</option>
//                 </select>
//                 <select
//                   value={row.rsvpStatus}
//                   onChange={(e) => updateParticipant(idx, { rsvpStatus: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 >
//                   <option value="PENDING">Pending</option>
//                   <option value="ACCEPTED">Accepted</option>
//                   <option value="DECLINED">Declined</option>
//                   <option value="TENTATIVE">Tentative</option>
//                 </select>
//                 <button
//                   type="button"
//                   aria-label="Remove participant"
//                   onClick={() => removeParticipantRow(idx)}
//                   className={iconBtnClass}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={addParticipantRow}
//             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
//           >
//             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
//               <Plus className="h-3 w-3" />
//             </span>
//             Add participant
//           </button>
//         </div>

//         {/* AGENDA */}
//         <div className="border-b border-gray-200 px-11 py-8">
//           <SectionHeader icon={ListChecks} title="Agenda" meta="Ordered as it will be presented" />
//           <div className="flex flex-col gap-2.5">
//             {agendaItems.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="grid grid-cols-[28px_1fr_90px_32px] items-start gap-3.5 rounded-lg border border-gray-100 bg-gray-50/40 p-3.5 max-sm:grid-cols-[24px_1fr_32px] max-sm:gap-2"
//               >
//                 <div className="mt-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-amber-100 font-mono text-[13px] font-medium text-amber-800">
//                   {idx + 1}
//                 </div>
//                 <div className="flex min-w-0 flex-col gap-1.5">
//                   <input
//                     type="text"
//                     placeholder="Topic"
//                     value={item.topic}
//                     onChange={(e) => updateAgendaItem(idx, { topic: e.target.value })}
//                     className="w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 text-[14.5px] font-medium text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-0"
//                   />
//                   <select
//                     value={item.presenterId}
//                     onChange={(e) => updateAgendaItem(idx, { presenterId: e.target.value })}
//                     className="border-0 bg-transparent p-0 text-[12px] text-gray-400 focus:outline-none focus:ring-0"
//                   >
//                     <option value="">No presenter</option>
//                     {employees.map((emp) => (
//                       <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
//                         Presenter: {emp.FIRST_NAME} {emp.LAST_NAME}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-1.5 self-center font-mono text-[12.5px] text-gray-600 max-sm:col-start-2">
//                   <input
//                     type="number"
//                     min="0"
//                     value={item.durationMinutes}
//                     onChange={(e) => updateAgendaItem(idx, { durationMinutes: e.target.value })}
//                     className="w-11 border-0 border-b border-transparent bg-transparent p-0.5 text-right font-mono text-[12.5px] focus:border-amber-600 focus:outline-none focus:ring-0"
//                   />
//                   min
//                 </div>
//                 <button
//                   type="button"
//                   aria-label="Remove agenda item"
//                   onClick={() => removeAgendaRow(idx)}
//                   className={`${iconBtnClass} self-center`}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={addAgendaRow}
//             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
//           >
//             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
//               <Plus className="h-3 w-3" />
//             </span>
//             Add agenda item
//           </button>
//           <div className="mt-4 flex items-baseline justify-between rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
//             <span className="text-[12.5px] text-gray-500">Estimated total</span>
//             <span className="font-mono text-[15px] font-semibold text-amber-800">{agendaTotal} min</span>
//           </div>
//         </div>

//         {/* MINUTES */}
//         <div className="px-11 py-8">
//           <SectionHeader icon={FileText} title="Meeting Minutes" meta="Optional" />
//           <div className="flex flex-col gap-2.5">
//             {minutes.map((row, idx) => (
//               <div
//                 key={idx}
//                 className="grid grid-cols-[1.4fr_1.2fr_2fr_32px] items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/40 p-2.5 max-sm:grid-cols-2"
//               >
//                 <select
//                   value={row.agendaItemIndex}
//                   onChange={(e) => updateMinute(idx, { agendaItemIndex: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 >
//                   <option value="">(General)</option>
//                   {agendaItems.map((a, i) => (
//                     <option key={i} value={i}>
//                       {a.topic || `Item ${i + 1}`}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={row.authorId}
//                   onChange={(e) => updateMinute(idx, { authorId: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 >
//                   <option value="">Select author</option>
//                   {employees.map((emp) => (
//                     <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
//                       {emp.FIRST_NAME} {emp.LAST_NAME}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Notes"
//                   value={row.notes}
//                   onChange={(e) => updateMinute(idx, { notes: e.target.value })}
//                   className={`${controlClass} bg-white`}
//                 />
//                 <button
//                   type="button"
//                   aria-label="Remove minute"
//                   onClick={() => removeMinuteRow(idx)}
//                   className={iconBtnClass}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={addMinuteRow}
//             className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700 hover:text-amber-800"
//           >
//             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
//               <Plus className="h-3 w-3" />
//             </span>
//             Add Minute
//           </button>
//         </div>
//       </form>

//       {/* FOOTER */}
//       <div className="sticky bottom-0 flex flex-col items-stretch justify-between gap-4 border-t border-gray-200 bg-white/95 px-11 py-5 backdrop-blur sm:flex-row sm:items-center">
//         <div className="text-[12.5px] text-gray-400">
//           {mode === "edit" ? "Editing existing meeting" : "Draft is saved separately from scheduling"}
//         </div>
//         <div className="flex gap-2.5 sm:justify-end">
//           <Button type="button" variant="outline" onClick={() => navigate("/dashboard/agenda")}>
//             Cancel
//           </Button>
//           <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
//             Save as draft
//           </Button>
//           <Button type="button" onClick={handleSchedule} disabled={isSubmitting} className="shadow-sm">
//             {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Schedule meeting"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDepartments, useEmployees, useMeetingRooms } from "./queries";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  ListChecks,
  FileText,
  Plus,
  X,
  Clock,
  MapPin,
  Video,
  ArrowLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Redesigned to match the Journal/Payment/Receive voucher design system —
// same card, sectionHeader, fieldLabel, fieldInput tokens, slate/indigo
// palette. Same state, same validation, same payload shape as before.
// ─────────────────────────────────────────────────────────────────────────────

const emptyParticipant = () => ({ employeeId: "", role: "ATTENDEE", rsvpStatus: "PENDING" });
const emptyAgendaItem = () => ({ topic: "", presenterId: "", durationMinutes: 15 });
const emptyMinute = () => ({ agendaItemIndex: "", authorId: "", notes: "" });

// Splits an ISO-like "YYYY-MM-DDTHH:MM:SS" string into { date, time }
const splitDateTime = (isoLike) => {
  if (!isoLike) return { date: "", time: "" };
  const [date, timePart] = isoLike.split("T");
  const time = timePart ? timePart.slice(0, 5) : "";
  return { date, time };
};

/* ── Shared design tokens (same family as JournalEdit / PaymentEdit) ──────── */
const card =
  "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
const sectionHeader =
  "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
const sectionIconWrap =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
const sectionSubtitle = "text-xs text-slate-400 mt-1";
const fieldLabel =
  "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
const fieldInput =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 transition-all";
const rowCard =
  "rounded-lg border border-slate-100 bg-slate-50/40 p-3";
const iconBtnClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:text-red-500 hover:bg-red-50";

function SectionHeader({ icon: Icon, title, meta }) {
  return (
    <div className={sectionHeader}>
      <div className={sectionIconWrap}>
        <Icon size={16} />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <h3 className={sectionTitle}>{title}</h3>
        </div>
        {meta && <p className={sectionSubtitle}>{meta}</p>}
      </div>
    </div>
  );
}

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
  const [minutes, setMinutes] = useState([emptyMinute()]);

  // Prefill on edit
  useEffect(() => {
    if (!initialData) return;

    // API response wraps the real payload under `.data` — unwrap it if present.
    const meeting = initialData.data ?? initialData;

    setTitle(meeting.TITLE || "");
    setDescription(meeting.DESCRIPTION || "");
    setOrganizerId(meeting.ORGANIZER_ID ? String(meeting.ORGANIZER_ID) : "");
    setDepartmentId(meeting.DEPARTMENT_ID ? String(meeting.DEPARTMENT_ID) : "");
    setMeetingType(meeting.MEETING_TYPE || "IN_PERSON");
    setRoomId(meeting.ROOM_ID ? String(meeting.ROOM_ID) : "");
    setVirtualLink(meeting.VIRTUAL_LINK || "");

    const { date: d, time: st } = splitDateTime(meeting.START_TIME);
    const { time: et } = splitDateTime(meeting.END_TIME);
    setDate(d);
    setStart(st);
    setEnd(et);

    if (Array.isArray(meeting.participants) && meeting.participants.length > 0) {
      setParticipants(
        meeting.participants.map((p) => ({
          employeeId: String(p.EMPLOYEE_ID),
          role: p.ROLE || "ATTENDEE",
          rsvpStatus: p.RSVP_STATUS || "PENDING",
        }))
      );
    }

    const loadedAgendaItems = Array.isArray(meeting.agendaItems) ? meeting.agendaItems : [];
    if (loadedAgendaItems.length > 0) {
      setAgendaItems(
        loadedAgendaItems.map((a) => ({
          topic: a.TOPIC || "",
          presenterId: a.PRESENTER_ID ? String(a.PRESENTER_ID) : "",
          durationMinutes: a.DURATION_MINUTES ?? 15,
        }))
      );
    }

    if (Array.isArray(meeting.minutes) && meeting.minutes.length > 0) {
      setMinutes(
        meeting.minutes.map((m) => ({
          agendaItemIndex: m.AGENDA_ITEM_ID
            ? String(loadedAgendaItems.findIndex((a) => a.AGENDA_ITEM_ID === m.AGENDA_ITEM_ID))
            : "",
          authorId: m.AUTHOR_ID ? String(m.AUTHOR_ID) : "",
          notes: m.NOTES || "",
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

  const updateMinute = (idx, patch) =>
    setMinutes((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const addMinuteRow = () => setMinutes((rows) => [...rows, emptyMinute()]);

  const removeMinuteRow = (idx) =>
    setMinutes((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

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

    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);

    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time.");
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
      startTime: startDateTime,
      endTime: endDateTime,
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
      // agendaItemIndex refers to the position in the agendaItems array above —
      // the backend resolves it to the real AGENDA_ITEM_ID after inserting agenda
      // items, since brand-new items don't have a real ID yet at submit time.
      minutes: minutes
        .filter((m) => m.notes.trim())
        .map((m) => ({
          agendaItemIndex: m.agendaItemIndex !== "" ? Number(m.agendaItemIndex) : null,
          authorId: m.authorId ? Number(m.authorId) : null,
          notes: m.notes.trim(),
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
    <div className="flex flex-col min-h-full">
      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/agenda")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              aria-label="Back to agenda list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Meeting Planner
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {mode === "edit" ? "Edit Meeting" : "Schedule a Meeting"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {mode === "edit"
                  ? "Update the details, agenda, and participants."
                  : "Set up meeting details, invite participants, and build the agenda."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSchedule} className="space-y-6">
          {/* ── Section: Meeting Details ─────────────────────────────────────── */}
          <div className={card}>
            <SectionHeader icon={CalendarDays} title="Meeting Details" />

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <label htmlFor="title" className={fieldLabel}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g. Q3 strategy review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={fieldInput}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className={fieldLabel}>
                  Description <span className="normal-case text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="description"
                  placeholder="What's this meeting about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${fieldInput} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="organizer" className={fieldLabel}>
                  Organizer
                </label>
                <select
                  id="organizer"
                  value={organizerId}
                  onChange={(e) => setOrganizerId(e.target.value)}
                  required
                  className={fieldInput}
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

              <div>
                <label htmlFor="department" className={fieldLabel}>
                  Department
                </label>
                <select
                  id="department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className={fieldInput}
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

              <div className="md:col-span-2">
                <label className={fieldLabel}>Meeting type</label>
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
                        className={`block rounded-lg border px-2 py-2.5 text-center text-[13px] font-medium transition-all ${
                          meetingType === opt.value
                            ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm ring-4 ring-indigo-500/10"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="room" className={`${fieldLabel} flex items-center gap-1.5`}>
                  <MapPin size={11} />
                  Room <span className="normal-case text-slate-400 font-normal">(optional)</span>
                </label>
                <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className={fieldInput}>
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.ROOM_ID} value={room.ROOM_ID}>
                      {room.ROOM_NAME}
                      {room.CAPACITY ? ` · ${room.CAPACITY} seats` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="link" className={`${fieldLabel} flex items-center gap-1.5`}>
                  <Video size={11} />
                  Video link <span className="normal-case text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="link"
                  placeholder="https://meet.company.com/..."
                  value={virtualLink}
                  onChange={(e) => setVirtualLink(e.target.value)}
                  className={fieldInput}
                />
              </div>

              <div>
                <label htmlFor="date" className={fieldLabel}>
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={fieldInput}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="start" className={`${fieldLabel} flex items-center gap-1.5`}>
                    <Clock size={11} />
                    Start time
                  </label>
                  <input
                    type="time"
                    id="start"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                    className={fieldInput}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="end" className={`${fieldLabel} flex items-center gap-1.5`}>
                    <Clock size={11} />
                    End time
                  </label>
                  <input
                    type="time"
                    id="end"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                    className={fieldInput}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section: Participants ────────────────────────────────────────── */}
          <div className={card}>
            <SectionHeader icon={Users} title="Participants" meta={`${participants.length} invited`} />

            <div className="p-6">
              <div className="flex flex-col gap-2.5">
                {participants.map((row, idx) => (
                  <div
                    key={idx}
                    className={`${rowCard} grid grid-cols-[2fr_1.4fr_1.2fr_32px] items-center gap-2.5 sm:grid-cols-[2fr_1.4fr_1.2fr_32px] max-sm:grid-cols-2`}
                  >
                    <select
                      value={row.employeeId}
                      onChange={(e) => updateParticipant(idx, { employeeId: e.target.value })}
                      className={`${fieldInput} bg-white`}
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
                      className={`${fieldInput} bg-white`}
                    >
                      <option value="ATTENDEE">Attendee</option>
                      <option value="PRESENTER">Presenter</option>
                      <option value="OPTIONAL">Optional</option>
                    </select>
                    <select
                      value={row.rsvpStatus}
                      onChange={(e) => updateParticipant(idx, { rsvpStatus: e.target.value })}
                      className={`${fieldInput} bg-white`}
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
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addParticipantRow}
                className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
                  <Plus size={12} />
                </span>
                Add participant
              </button>
            </div>
          </div>

          {/* ── Section: Agenda ──────────────────────────────────────────────── */}
          <div className={card}>
            <SectionHeader icon={ListChecks} title="Agenda" meta="Ordered as it will be presented" />

            <div className="p-6">
              <div className="flex flex-col gap-2.5">
                {agendaItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${rowCard} grid grid-cols-[28px_1fr_90px_32px] items-start gap-3.5 max-sm:grid-cols-[24px_1fr_32px] max-sm:gap-2`}
                  >
                    <div className="mt-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-indigo-100 font-mono text-[13px] font-semibold text-indigo-700">
                      {idx + 1}
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder="Topic"
                        value={item.topic}
                        onChange={(e) => updateAgendaItem(idx, { topic: e.target.value })}
                        className="w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 text-[14.5px] font-medium text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-0"
                      />
                      <select
                        value={item.presenterId}
                        onChange={(e) => updateAgendaItem(idx, { presenterId: e.target.value })}
                        className="border-0 bg-transparent p-0 text-[12px] text-slate-400 focus:outline-none focus:ring-0"
                      >
                        <option value="">No presenter</option>
                        {employees.map((emp) => (
                          <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
                            Presenter: {emp.FIRST_NAME} {emp.LAST_NAME}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5 self-center font-mono text-[12.5px] text-slate-600 max-sm:col-start-2">
                      <input
                        type="number"
                        min="0"
                        value={item.durationMinutes}
                        onChange={(e) => updateAgendaItem(idx, { durationMinutes: e.target.value })}
                        className="w-11 border-0 border-b border-transparent bg-transparent p-0.5 text-right font-mono text-[12.5px] focus:border-indigo-400 focus:outline-none focus:ring-0"
                      />
                      min
                    </div>
                    <button
                      type="button"
                      aria-label="Remove agenda item"
                      onClick={() => removeAgendaRow(idx)}
                      className={`${iconBtnClass} self-center`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addAgendaRow}
                className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
                  <Plus size={12} />
                </span>
                Add agenda item
              </button>

              <div className="mt-4 flex items-baseline justify-between rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3">
                <span className="text-[12.5px] text-slate-500">Estimated total</span>
                <span className="font-mono text-[15px] font-semibold text-indigo-700">{agendaTotal} min</span>
              </div>
            </div>
          </div>

          {/* ── Section: Meeting Minutes ─────────────────────────────────────── */}
          <div className={card}>
            <SectionHeader icon={FileText} title="Meeting Minutes" meta="Optional" />

            <div className="p-6">
              <div className="flex flex-col gap-2.5">
                {minutes.map((row, idx) => (
                  <div
                    key={idx}
                    className={`${rowCard} grid grid-cols-[1.4fr_1.2fr_2fr_32px] items-center gap-2.5 max-sm:grid-cols-2`}
                  >
                    <select
                      value={row.agendaItemIndex}
                      onChange={(e) => updateMinute(idx, { agendaItemIndex: e.target.value })}
                      className={`${fieldInput} bg-white`}
                    >
                      <option value="">(General)</option>
                      {agendaItems.map((a, i) => (
                        <option key={i} value={i}>
                          {a.topic || `Item ${i + 1}`}
                        </option>
                      ))}
                    </select>
                    <select
                      value={row.authorId}
                      onChange={(e) => updateMinute(idx, { authorId: e.target.value })}
                      className={`${fieldInput} bg-white`}
                    >
                      <option value="">Select author</option>
                      {employees.map((emp) => (
                        <option key={emp.EMPLOYEE_ID} value={emp.EMPLOYEE_ID}>
                          {emp.FIRST_NAME} {emp.LAST_NAME}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Notes"
                      value={row.notes}
                      onChange={(e) => updateMinute(idx, { notes: e.target.value })}
                      className={`${fieldInput} bg-white`}
                    />
                    <button
                      type="button"
                      aria-label="Remove minute"
                      onClick={() => removeMinuteRow(idx)}
                      className={iconBtnClass}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMinuteRow}
                className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current">
                  <Plus size={12} />
                </span>
                Add Minute
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky footer action bar — same pattern as JournalEdit/PaymentEdit */}
      <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            {mode === "edit" ? "Editing existing meeting" : "Draft is saved separately from scheduling"}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate("/dashboard/agenda")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              onClick={handleSchedule}
              disabled={isSubmitting}
              className="text-white shadow-sm"
            >
              {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Schedule meeting"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}