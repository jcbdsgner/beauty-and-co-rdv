import { Suspense } from "react";
import { ComptePageContent } from "@/components/compte/compte-page-content";

export default function ComptePage() {
  return (
    <Suspense fallback={null}>
      <ComptePageContent />
    </Suspense>
  );
}
