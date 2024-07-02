import Image from "next/image";

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

export function ImageButton({
  buttonText,
  onClick,
  className,
  src,
  alt,
  height,
  width,
}: {
  buttonText: string;
  onClick: () => void;
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
          <p>{buttonText}</p>
        </div>
      </div>
    </button>
  );
}
