type ToastTypes = {
  success: string;
  error: string;
  warning: string;
  info: string;
};

type ToastType = keyof ToastTypes;

export function Toast({
  toastText,
  toastType,
  className,
}: {
  toastText: string;
  toastType: ToastType;
  className?: string;
}) {
  const typeToColorClass: ToastTypes = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`toast toast-center toast-top`}>
      <div
        className={`erroralert rounded-full px-6 py-3 text-white ${className} ${typeToColorClass[toastType]}`}
      >
        <span>{toastText}</span>
      </div>
    </div>
  );
}
