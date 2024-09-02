import { type Accommodation } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accommodationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        checkIn: z.date(),
        checkOut: z.date(),
        notes: z.string(),
        phoneNumber: z.string(),
        website: z.string(),
        tripId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Accommodation> => {
      const accommodation = ctx.db.accommodation.create({
        data: {
          name: input.name,
          location: input.location,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          notes: input.notes,
          phoneNumber: input.phoneNumber,
          website: input.website,
          tripId: input.tripId,
        },
      });
      return accommodation;
    }),

  getall: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      const allAccommodations = ctx.db.accommodation.findMany({
        where: { tripId: input.tripId },
      });
      return allAccommodations;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accommodation = await ctx.db.accommodation.findUnique({
        where: { id: input.id },
      });

      return accommodation;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        notes: z.string().optional(),
        phoneNumber: z.string().optional(),
        website: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.accommodation.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.accommodation.delete({
        where: { id: input.id },
      });
    }),
});
