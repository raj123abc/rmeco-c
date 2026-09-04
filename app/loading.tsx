import { RotatingLogo } from "@/components/ui/RotatingLogo";

export default function Loading() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
        <RotatingLogo label="Loading page" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
