import { LoginForm } from "@/components/auth/LoginForm";
import { Wordmark } from "@/components/brand/Wordmark";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <Wordmark className="mb-8" />
      <h1 className="font-display text-4xl">Log in</h1>
      <p className="mt-2 text-sm opacity-70">Optional for shopping. Required for admin and order history.</p>
      <LoginForm nextPath={next ?? ""} />
    </div>
  );
}
