import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tripRouter } from "./routers/trip";
import { accommodationRouter } from "./routers/accomodation";
import { itineraryRouter } from "./routers/itinerary";
import { itineraryItemRouter } from "./routers/itineraryItem";
import { packingListRouter } from "./routers/packing-list";
import { packingCategoryRouter } from "./routers/packingCategory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trip: tripRouter,
  accommodation: accommodationRouter,
  itinerary: itineraryRouter,
  itineraryItem: itineraryItemRouter,
  packingList: packingListRouter,
  packingCategory: packingCategoryRouter,
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
