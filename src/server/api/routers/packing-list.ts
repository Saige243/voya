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

  addItems: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        items: z.array(
          z.object({
            packingListId: z.number(),
            categoryId: z.number(),
            name: z.string(),
            quantity: z.number().optional().default(1),
            isPacked: z.boolean().optional().default(false),
            notes: z.string().optional().default(""),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { items } = input;

      const createdItems = await ctx.db.packingListItem.createMany({
        data: items.map((item) => ({
          packingListId: item.packingListId,
          categoryId: item.categoryId,
          name: item.name,
          quantity: item.quantity ?? 1,
          isPacked: item.isPacked ?? false,
          notes: item.notes ?? "",
        })),
      });

      return createdItems;
    }),

  getAll: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      const allPackingLists = ctx.db.packingList.findMany({
        where: { tripId: input.tripId },
      });

      return packingList;
    }),

  getAll: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(({ ctx, input }) => {
      const allPackingLists = ctx.db.packingList.findMany({
        where: { tripId: input.tripId },
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
