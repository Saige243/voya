export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col">My Trip: {params.slug}</main>
  );
}
