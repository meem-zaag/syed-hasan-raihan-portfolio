import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-signal">error / 404</p>
      <h1 className="font-display mt-4 text-5xl font-medium text-foreground">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
