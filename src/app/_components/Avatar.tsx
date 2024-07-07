import Image from "next/image";

export default function Avatar({
  alt,
  image,
  width,
}: {
  alt: string;
  image: string;
  width: number;
}) {
  return (
    <div className="avatar">
      <div className={`w-${width} rounded-full`}>
        <Image alt={alt} src={image} width={width} height={width} />
      </div>
    </div>
  );
}
