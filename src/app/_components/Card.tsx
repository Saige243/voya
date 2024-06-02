export function Card({
  title,
  description,
  buttonText,
  children,
}: {
  title: string;
  description: string;
  buttonText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="pb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
