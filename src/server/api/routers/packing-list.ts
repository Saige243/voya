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

  createMany: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        items: z.array(
          z.object({
            categoryId: z.number(),
            name: z.string(),
            quantity: z.number().optional().default(1),
            isPacked: z.boolean().optional().default(false),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tripId, items } = input;

      // 1. Find or create the packing list
      let packingList = await ctx.db.packingList.findUnique({
        where: { tripId },
      });

      if (!packingList) {
        packingList = await ctx.db.packingList.create({
          data: { tripId },
        });
      }

      // 2. Create items with that packing list ID
      const createdItems = await ctx.db.packingListItem.createMany({
        data: items.map((item) => ({
          packingListId: packingList.id,
          categoryId: item.categoryId,
          name: item.name,
          quantity: item.quantity ?? 1,
          isPacked: item.isPacked ?? false,
        })),
      });

      return createdItems;
    }),

  getById: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        include: z
          .object({
            items: z.boolean(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const packingList = await ctx.db.packingList.findUnique({
        where: { tripId: input.tripId },
        include: {
          items: input.include?.items ?? false,
        },
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

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        isPacked: z.boolean().optional(),
        name: z.string().optional(),
        quantity: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.packingListItem.update({
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
