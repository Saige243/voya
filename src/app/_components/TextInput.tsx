export function TextInput({
  placeholder,
  className,
  name,
  id,
  defaultValue,
  required,
}: {
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type="text"
      id={id}
      required={required}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`input input-bordered w-full ${className}`}
    />
  );
}
