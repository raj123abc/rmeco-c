"use client";

import { useId, useState } from "react";

type BillPhotoInputProps = {
  hasCurrentImage?: boolean;
};

export function BillPhotoInput({ hasCurrentImage }: BillPhotoInputProps) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState("");

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFile(file?.name ?? "");
  }

  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label
          htmlFor={`${inputId}-camera`}
          className="focus-ring rounded bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Take photo
        </label>
        <label
          htmlFor={`${inputId}-gallery`}
          className="focus-ring rounded border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Choose image
        </label>
      </div>

      <input
        id={`${inputId}-camera`}
        type="file"
        name="cameraBillImage"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="sr-only"
      />
      <input
        id={`${inputId}-gallery`}
        type="file"
        name="galleryBillImage"
        accept="image/*"
        onChange={onFileChange}
        className="sr-only"
      />

      <p className="mt-3 text-xs text-slate-500">
        {selectedFile
          ? `Selected: ${selectedFile}`
          : hasCurrentImage
            ? "Current image will be kept unless a new photo or image is selected."
            : "Use Take photo on mobile to open the back camera, or choose an existing image."}
      </p>
    </div>
  );
}
