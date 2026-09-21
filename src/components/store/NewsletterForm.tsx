"use client";

import { useActionState } from "react";
import { newsletterAction } from "@/app/actions/store";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(newsletterAction, undefined);
  return (
    <form action={action} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="min-h-12 flex-1 rounded-full px-4 text-[var(--season-fg)]"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-full bg-[var(--season-fg)] px-6 font-semibold text-white"
      >
        {pending ? "Saving…" : "Join"}
      </button>
      {state && "error" in state ? <p className="text-sm">{state.error}</p> : null}
      {state && "ok" in state ? <p className="text-sm">You’re on the list.</p> : null}
    </form>
  );
}
