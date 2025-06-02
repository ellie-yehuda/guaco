export function Badge({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <span
        className={`inline-block rounded-full border border-green-600 px-3 py-1 text-xs font-medium text-green-700 ${className}`}
      >
        {children}
      </span>
    );
  }
  