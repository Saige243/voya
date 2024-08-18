import { type Trip } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tripRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        destination: z.string().min(1),
        startDate: z.date(),
        endDate: z.date(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Trip> => {
      const trip = ctx.db.trip.create({
        data: {
          title: input.title,
          destination: input.destination,
          startDate: input.startDate,
          endDate: input.endDate,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
      return trip;
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    const allTrips = ctx.db.trip.findMany({
      where: { userId: ctx.session.user.id },
    });
    return allTrips;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.trip.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        destination: z.string().min(1).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.trip.update({
        where: { id },
        data: {
          ...data,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.trip.delete({
        where: { id: input },
      });
    }),
});
