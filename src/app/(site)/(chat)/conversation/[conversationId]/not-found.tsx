import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4 text-center text-[var(--text-primary)]">
      <h2 className="text-lg font-semibold">Conversation not found</h2>
      <p className="text-sm opacity-70">
        It may have been deleted, or the link is incorrect.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
      >
        Start a new chat
      </Link>
    </div>
  );
}