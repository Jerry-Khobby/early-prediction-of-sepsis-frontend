"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hook";
import { ManualExport } from "./manual-export";
import { CsvExport } from "./csv-export";
import { InlineAlert } from "./ui/inline-alert";
export function PDFPreview() {
  const router = useRouter();
  const { csvResult, manualResult, predictionType } = useAppSelector(
    (state) => state.prediction
  );
  const [noResult, setNoResult] = useState(false);
  useEffect(() => {
    if (!csvResult && !manualResult) {
      setNoResult(true);
    }
  }, [csvResult, manualResult]);
  if (noResult) {
    return (
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        <InlineAlert
          title="No Results Found"
          description="It looks like you haven't uploaded any data or run a prediction yet."
        />
        <p className="mt-4 text-muted-foreground dark:text-gray-400 max-w-md">
          Please upload a file or enter patient details manually to get a
          prediction.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="mt-6 text-[#44bfb2] text-sm font-medium hover:underline transition"
        >
          Go to Upload Page
        </button>
      </main>
    );
  }
  return (
    <div>
      {predictionType === "manual" && manualResult && <ManualExport />}
      {predictionType === "csv" && manualResult && <CsvExport />}
    </div>
  );
}
