"use client";

import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";

const field = "mt-1 h-12 w-full rounded-2xl border border-[var(--season-fg)]/10 bg-white px-3";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [loginState, login, loginPending] = useActionState(loginAction, undefined);
  const [regState, register, regPending] = useActionState(registerAction, undefined);
  return (
    <div className="mt-8 space-y-10">
      <form action={login} className="space-y-3">
        <input type="hidden" name="next" value={nextPath} />
        <label className="block text-sm">
          Email
          <input name="email" type="email" required className={field} autoComplete="email" />
        </label>
        <label className="block text-sm">
          Password
          <input name="password" type="password" required className={field} autoComplete="current-password" />
        </label>
        {loginState?.error ? <p className="text-sm text-red-700">{loginState.error}</p> : null}
        <button disabled={loginPending} className="h-12 w-full rounded-full bg-[var(--season-fg)] font-semibold text-white">
          Log in
        </button>
      </form>
      <div>
        <h2 className="font-display text-2xl">Create an account</h2>
        <form action={register} className="mt-4 space-y-3">
          <label className="block text-sm">
            Name
            <input name="name" required className={field} />
          </label>
          <label className="block text-sm">
            Email
            <input name="email" type="email" required className={field} />
          </label>
          <label className="block text-sm">
            Password
            <input name="password" type="password" required className={field} autoComplete="new-password" />
          </label>
          {regState?.error ? <p className="text-sm text-red-700">{regState.error}</p> : null}
          <button disabled={regPending} className="h-12 w-full rounded-full border border-[var(--season-fg)] font-semibold">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
