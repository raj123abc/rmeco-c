"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMode, PaymentStatus } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import type { BillActionState } from "@/lib/actions/bills";
import { BillPhotoInput } from "@/components/bills/BillPhotoInput";
import { FormPendingOverlay, SubmitButton } from "@/components/ui/FormStatus";
import { useActionToast } from "@/components/ui/Toast";
import { humanizeEnum } from "@/lib/formatters";
import {
  billSchema,
  paymentModeOptions,
  paymentStatusOptions,
  type BillFormValues
} from "@/lib/validations/bill";

type BillFormProps = {
  title: string;
  submitLabel: string;
  action: (state: BillActionState, formData: FormData) => Promise<BillActionState>;
  initialValues?: Partial<BillFormValues> & {
    billImageUrl?: string | null;
  };
  parties?: {
    id: string;
    partyName: string;
    partyCode: string;
    location: string;
  }[];
};

const defaultValues: BillFormValues = {
  partyId: "",
  partyName: "",
  billNumber: "",
  billDate: new Date().toISOString().slice(0, 10),
  billAmount: 0,
  paymentStatus: PaymentStatus.UNPAID,
  paymentMode: PaymentMode.CREDIT,
  notes: ""
};

export function BillForm({ title, submitLabel, action, initialValues, parties = [] }: BillFormProps) {
  const [state, formAction] = useActionState(action, { ok: false });
  useActionToast(state.message);
  const {
    register,
    setValue,
    formState: { errors }
  } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues
    }
  });

  const fieldError = (name: keyof BillFormValues) =>
    errors[name]?.message || state.errors?.[name]?.[0];
  const partyIdRegister = register("partyId");

  return (
    <form action={formAction} className="relative max-w-3xl rounded border border-slate-200 bg-white p-5 shadow-soft">
      <FormPendingOverlay />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
        {state.message ? (
          <p className="mt-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Saved party" error={fieldError("partyId")} className="sm:col-span-2">
          <select
            {...partyIdRegister}
            onChange={(event) => {
              partyIdRegister.onChange(event);
              const party = parties.find((item) => item.id === event.target.value);

              if (party) {
                setValue("partyName", party.partyName, { shouldValidate: true, shouldDirty: true });
              }
            }}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
          >
            <option value="">Manual party name</option>
            {parties.map((party) => (
              <option key={party.id} value={party.id}>
                {party.partyCode} - {party.partyName} ({party.location})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Select a saved party or keep manual entry for old-style bills.{" "}
            <Link href="/parties/new" className="font-medium text-brand-700 hover:text-brand-600">
              Add party
            </Link>
          </p>
        </Field>

        <Field label="Party name" error={fieldError("partyName")}>
          <input
            {...register("partyName")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="Supplier or distributor name"
          />
        </Field>

        <Field label="Bill number" error={fieldError("billNumber")}>
          <input
            {...register("billNumber")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="Invoice or bill number"
          />
        </Field>

        <Field label="Bill date" error={fieldError("billDate")}>
          <input
            type="date"
            {...register("billDate")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
          />
        </Field>

        <Field label="Bill amount" error={fieldError("billAmount")}>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("billAmount")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="0.00"
          />
        </Field>

        <Field label="Payment status" error={fieldError("paymentStatus")}>
          <select
            {...register("paymentStatus")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
          >
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {humanizeEnum(status)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Payment mode" error={fieldError("paymentMode")}>
          <select
            {...register("paymentMode")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
          >
            {paymentModeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {humanizeEnum(mode)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Bill photo" className="sm:col-span-2">
          <BillPhotoInput hasCurrentImage={Boolean(initialValues?.billImageUrl)} />
        </Field>

        <Field label="Notes" error={fieldError("notes")} className="sm:col-span-2">
          <textarea
            {...register("notes")}
            rows={4}
            className="focus-ring w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional purchase or payment notes"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/bills"
          className="rounded border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
    </div>
  );
}
