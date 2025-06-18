import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tripRouter } from "./routers/trip";
import { accommodationRouter } from "./routers/accomodation";
import { itineraryRouter } from "./routers/itinerary";
import { itineraryItemRouter } from "./routers/itineraryItem";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  trip: tripRouter,
  accommodation: accommodationRouter,
  itinerary: itineraryRouter,
  itineraryItem: itineraryItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
