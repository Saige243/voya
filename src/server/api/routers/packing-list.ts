import { type PackingList } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const packingListRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<PackingList> => {
      const packingList = ctx.db.packingList.create({
        data: {
          tripId: input.tripId,
        },
      });
      return packingList;
    }),

  getAll: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      const allPackingLists = ctx.db.packingList.findMany({
        where: { tripId: input.tripId },
        include: { groups: true },
      });
      return allPackingLists;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const packingList = await ctx.db.packingList.findUnique({
        where: { id: input.id },
      });

      return packingList;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tripId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.packingList.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.packingList.delete({
        where: { id: input.id },
      });
    }),
});
