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
  return (
    <div
      className={`card h-fit bg-base-100 shadow-xl dark:text-white ${className}`}
    >
      <div className="card-body">
        <h2 className="card-title text-2xl dark:text-white">{title}</h2>
        <p className="pb-4 text-lg font-semibold">{description}</p>
        {children}
      </div>
    </div>
  );
}
