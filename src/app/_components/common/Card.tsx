export function Card({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cardHeader = (
    <div className="p-8">
      <h2 className="card-title text-2xl dark:text-white">{title}</h2>
      <p className="text-lg font-semibold">{description}</p>
    </div>
  );

  return (
    <div
      className={`card h-fit bg-base-100 shadow-xl dark:text-white ${className}`}
    >
      {title && description && <div className="card-header">{cardHeader}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}
