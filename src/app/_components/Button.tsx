import Image from "next/image";

export function Button({
  onClick,
  className,
  children,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function ImageButton({
  children,
  onClick,
  className,
  src,
  alt,
  height,
  width,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  src: string;
  alt: string;
  height: number;
  width: number;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      <div className="flex items-center text-center">
        <Image src={src} alt={alt} width={width} height={height} />
        <div>
          <p>{children}</p>
        </div>
      </div>
    </button>
  );
}
