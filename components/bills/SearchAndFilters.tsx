"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RotatingLogo } from "@/components/ui/RotatingLogo";
import { locationOptions } from "@/lib/locations";
import { humanizeEnum } from "@/lib/formatters";
import type { BillFilterValues } from "@/lib/validations/bill";
import { paymentStatusOptions } from "@/lib/validations/bill";

type SearchAndFiltersProps = {
  filters: BillFilterValues;
  parties: {
    id: string;
    partyName: string;
    partyCode: string;
    location: string;
  }[];
};

export function SearchAndFilters({ filters, parties }: SearchAndFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      const trimmedValue = String(value).trim();
      if (trimmedValue) {
        params.set(key, trimmedValue);
      }
    }

    startTransition(() => {
      router.push(`/bills${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <form
      action={onSubmit}
      className="grid gap-3 rounded border border-slate-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-[1fr_220px_180px_170px_150px_150px_auto_auto]"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Search
        </span>
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Party name or bill number"
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Party
        </span>
        <select
          name="partyId"
          defaultValue={filters.partyId}
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        >
          <option value="">All parties</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.partyCode} - {party.partyName}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Location
        </span>
        <select
          name="location"
          defaultValue={filters.location}
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        >
          <option value="">All locations</option>
          {locationOptions.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Status
        </span>
        <select
          name="paymentStatus"
          defaultValue={filters.paymentStatus}
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        >
          <option value="">All status</option>
          {paymentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {humanizeEnum(status)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          From
        </span>
        <input
          type="date"
          name="from"
          defaultValue={filters.from}
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          To
        </span>
        <input
          type="date"
          name="to"
          defaultValue={filters.to}
          className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="focus-ring h-10 self-end rounded bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <RotatingLogo label="Applying filters" size="sm" />
            Applying...
          </span>
        ) : (
          "Apply"
        )}
      </button>
      <Link
        href="/bills"
        className="h-10 self-end rounded border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Reset
      </Link>
    </form>
  );
}
