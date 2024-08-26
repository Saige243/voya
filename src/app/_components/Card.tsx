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
    <div className={`card h-fit w-fit bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="pb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
