export function Card({
    children,
    className = "",
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
  
  export function CardHeader({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return <div className={`mb-2 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>
    );
  }
  
  export function CardContent({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return <div className={className}>{children}</div>;
  }
  