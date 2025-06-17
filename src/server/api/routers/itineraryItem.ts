import { type ItineraryItem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const itineraryItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        date: z.string().datetime(), // ISO string for the itinerary date
        title: z.string(),
        time: z.string().datetime().optional(), // ISO time string (optional)
        location: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<ItineraryItem> => {
      const { tripId, date, time, ...rest } = input;

      const itineraryDate = new Date(date);

      // Find or create itinerary for the given date
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

      // Create the itinerary item
      return ctx.db.itineraryItem.create({
        data: {
          ...rest,
          itineraryId: itinerary.id,
          date: itineraryDate,
          time: time ? new Date(time) : undefined,
        },
      });
    }),
});
