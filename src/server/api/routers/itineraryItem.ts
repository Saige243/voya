import { type ItineraryItem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const itineraryItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        date: z
          .date()
          .min(new Date(), { message: "Date must be in the future" }),
        title: z.string(),
        time: z
          .date()
          .min(new Date(), { message: "Time must be in the future" }),
        description: z.string().nullable().optional(),
        location: z.string(),
        notes: z.string().optional(),
        isMeal: z.boolean().optional(),
        mealType: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<ItineraryItem> => {
      let itinerary = await ctx.db.itinerary.findFirst({
        where: { tripId: input.tripId, date: input.date },
      });

      if (!itinerary) {
        itinerary = await ctx.db.itinerary.create({
          data: {
            tripId: input.tripId,
            date: input.date,
          },
        });
      }

      return ctx.db.itineraryItem.create({
        data: {
          itineraryId: itinerary.id,
          title: input.title,
          description: input.description ?? null,
          time: input.time,
          location: input.location,
          isMeal: input.isMeal ?? false,
          mealType: input.mealType ?? null,
          notes: input.notes ?? null,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.itineraryItem.findMany({
        where: { itinerary: { tripId: input.tripId } },
        include: { itinerary: true },
        orderBy: { time: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.itineraryItem.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        time: z.union([z.string().datetime(), z.date()]).optional(),
        description: z.string().nullable().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (data.time && typeof data.time === "string") {
        data.time = new Date(data.time);
      }

      return ctx.db.itineraryItem.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.itineraryItem.delete({
        where: { id: input.id },
      });
    }),
});
