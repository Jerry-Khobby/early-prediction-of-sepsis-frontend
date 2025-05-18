"use client";

import { ReloadIcon } from "@radix-ui/react-icons";

export const PredictionLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ReloadIcon className="h-12 w-12 animate-spin text-teal-600" />
      <p className="mt-4 text-lg">Processing your prediction results...</p>
    </div>
  );
};
