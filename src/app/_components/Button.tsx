import Image from "next/image";

export function Button({
  onClick,
  className,
  children,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  src: string;
  alt: string;
  height: number;
  width: number;
}) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      <div className="flex items-center text-center">
        <Image src={src} alt={alt} width={width} height={height} />
        <div>
          <p>{children}</p>
        </div>
      </div>
    </button>
  );
}
