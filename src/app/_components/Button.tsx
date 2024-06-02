export function Button({
  buttonText,
  onClick,
  className,
}: {
  buttonText: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {buttonText}
    </button>
  );
}
