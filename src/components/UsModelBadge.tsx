interface UsModelBadgeProps {
  className?: string;
}

export default function UsModelBadge({ className = '' }: UsModelBadgeProps) {
  return (
    <p
      role="note"
      className={`inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ${className}`}
    >
      US model — rules differ in Ireland & EU
    </p>
  );
}
