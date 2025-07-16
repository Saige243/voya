import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const packingCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.packingCategory.findMany({
      orderBy: { name: "asc" },
    });
  }),
});
