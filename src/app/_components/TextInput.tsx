export function TextInput({
  placeholder,
  className,
}: {
  placeholder: string;
  className: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`input input-bordered w-full max-w-xs ${className}`}
    />
  );
}
