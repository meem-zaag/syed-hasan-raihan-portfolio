export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-signal" />
        <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
