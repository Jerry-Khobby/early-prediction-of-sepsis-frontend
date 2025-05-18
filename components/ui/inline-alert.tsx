// components/ui/inline-alert.tsx
import { AlertCircle } from "lucide-react";

export function InlineAlert({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-500/40 dark:bg-red-950 dark:text-red-300 mb-6">
      <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
