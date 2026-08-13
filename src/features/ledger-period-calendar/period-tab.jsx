// import { AlertCircle, ListTree, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Spinner } from "@/components/ui/spinner";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// import { usePeriodTypes } from "./queries";

// export default function PeriodTypesTab() {
//   const { data: periodTypes = [], isLoading, isError, error, refetch, isFetching } = usePeriodTypes();

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16">
//         <Spinner className="h-10 w-10 mb-4" />
//         <p className="text-muted-foreground">Loading period types...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error Loading Period Types</AlertTitle>
//         <AlertDescription className="mt-2 flex flex-col gap-2">
//           <p>{error?.message || "Failed to load period types."}</p>
//           <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//             {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//           </Button>
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Code</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead className="text-right">Periods/Year</TableHead>
//             <TableHead>Description</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {periodTypes.length ? (
//             periodTypes.map((t) => (
//               <TableRow key={t.PERIOD_TYPE_ID}>
//                 <TableCell className="font-mono text-xs font-semibold">{t.TYPE_CODE}</TableCell>
//                 <TableCell className="font-medium">{t.TYPE_NAME}</TableCell>
//                 <TableCell className="text-right tabular-nums">{t.PERIODS_PER_YEAR}</TableCell>
//                 <TableCell className="text-muted-foreground">{t.DESCRIPTION}</TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={4} className="h-24 text-center">
//                 <Empty>
//                   <EmptyHeader>
//                     <EmptyMedia variant="icon"><ListTree /></EmptyMedia>
//                     <EmptyTitle>No Period Types Found</EmptyTitle>
//                   </EmptyHeader>
//                 </Empty>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


import { useState } from "react";
import { AlertCircle, ListTree, RefreshCw, Pencil, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { usePeriodTypes } from "./queries";
import PeriodTypeFormSheet from "./period-type-add-edit";

export default function PeriodTypesTab() {
  const { data: periodTypes = [], isLoading, isError, error, refetch, isFetching } = usePeriodTypes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const openAdd = () => { setEditingType(null); setIsFormOpen(true); };
  const openEdit = (type) => { setEditingType(type); setIsFormOpen(true); };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-10 w-10 mb-4" />
        <p className="text-muted-foreground">Loading period types...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Period Types</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load period types."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={openAdd}>
          <ListPlus className="mr-1 h-4 w-4" />Add Period Type
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Periods/Year</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {periodTypes.length ? (
              periodTypes.map((t) => (
                <TableRow key={t.PERIOD_TYPE_ID}>
                  <TableCell className="font-mono text-xs font-semibold">{t.TYPE_CODE}</TableCell>
                  <TableCell className="font-medium">{t.TYPE_NAME}</TableCell>
                  <TableCell className="text-right tabular-nums">{t.PERIODS_PER_YEAR}</TableCell>
                  <TableCell className="text-muted-foreground">{t.DESCRIPTION}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><ListTree /></EmptyMedia>
                      <EmptyTitle>No Period Types Found</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
        <PeriodTypeFormSheet
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          periodType={editingType}
        />
      )}
    </div>
  );
}