import { type Itinerary } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const itineraryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        title: z.string().min(1),
        datetime: z.date(),
        location: z.string().min(1),
        notes: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Itinerary> => {
      const itinerary = ctx.db.itinerary.create({
        data: {
          tripId: input.tripId,
          title: input.title,
          datetime: input.datetime,
          location: input.location,
          notes: input.notes,
        },
      });
      return itinerary;
    }),

  getAll: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      const allItineraries = ctx.db.itinerary.findMany({
        where: { tripId: input.tripId },
      });
      return allItineraries;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const itinerary = await ctx.db.itinerary.findUnique({
        where: { id: input.id },
      });

      return itinerary;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        datetime: z.date().optional(),
        location: z.string().min(1).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (data.datetime) {
        data.datetime = new Date(data.datetime);
      }

      return ctx.db.itinerary.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.itinerary.delete({
        where: { id: input.id },
      });
    }),
});
