import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Dashboard() {
  // const hello = await api.post.hello({ text: ", time to travel" });
  const session = await getServerAuthSession();

  const travelPhrases = [
    "Time to explore",
    "Time to travel",
    "Time to discover",
    "Time for adventure",
    "Time for a journey",
    "Time for a trip",
    "Time for a vacation",
    "Time for a holiday",
    "Time for a getaway",
    "Time for a break",
  ];

  const randomTravelPhrase =
    travelPhrases[Math.floor(Math.random() * travelPhrases.length)];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {randomTravelPhrase}
          {", "}
          <span className="text-[hsl(280,100%,70%)]">
            {session?.user?.name}
          </span>
          .
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {/* {hello ? hello.greeting : "Loading tRPC query..."} */}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            {!session && (
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            )}
          </div>
        </div>
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
