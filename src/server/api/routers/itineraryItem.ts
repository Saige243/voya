import { type ItineraryItem} from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const itineraryItemRouter = createTRPCRouter({
  create: protectedProcedure
  .input(z.object({
    tripId: z.number(),
    date: z.string().datetime(), // ISO string for the item/day
    title: z.string(),
    time: z.string().datetime().optional(),
    location: z.string(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }): Promise<ItineraryItem> => {
    const { tripId, date, ...itemData } = input;

    const itineraryDate = new Date(date);

    let itinerary = await ctx.db.itinerary.findFirst({
      where: { tripId, date: itineraryDate },
    });

    if (!itinerary) {
      itinerary = await ctx.db.itinerary.create({
        data: {
          tripId,
          date: itineraryDate,
        },
      });
    }

    // Create the item
    return ctx.db.itineraryItem.create({
      data: {
        ...itemData,
        itineraryId: itinerary.id,
      },
    });
  });