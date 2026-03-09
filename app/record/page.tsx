import { Suspense } from "react";

import { RecordEditor } from "@/components/record-editor";

export default function DailyRecordPage() {
  return (
    <Suspense fallback={null}>
      <RecordEditor />
    </Suspense>
  );
}
