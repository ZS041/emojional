


import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "../trpc";




export const likesRouter = createTRPCRouter({
    create: privateProcedure
      .input(z.object({ postId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.userId;
        const existingLike = await ctx.prisma.like.findUnique({
          where: { userId_postId: { userId, postId: input.postId } },
        });
  
        if (existingLike) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Post already liked' });
        }
  
        const like = await ctx.prisma.like.create({
          data: {
            userId,
            postId: input.postId,
          },
        });
  
        return like;
      }),

      countLikes: privateProcedure
  .input(z.object({ postId: z.string() }))
  .query(async ({ ctx, input }) => {
    const likesCount = await ctx.prisma.like.count({
      where: { postId: input.postId },
    });

    return likesCount;
  }),

      hasLiked: privateProcedure
      .input(z.object({ postId: z.string() }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.userId;
        const existingLike = await ctx.prisma.like.findUnique({
          where: { userId_postId: { userId, postId: input.postId } },
        });
  
        return !!existingLike;
      }),
  
    delete: privateProcedure
      .input(z.object({ postId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.userId;
        const existingLike = await ctx.prisma.like.findUnique({
          where: { userId_postId: { userId, postId: input.postId } },
        });
  
        if (!existingLike) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Post not liked' });
        }
  
        await ctx.prisma.like.delete({
          where: { id: existingLike.id },
        });
  
        return { success: true };
      }),
  });