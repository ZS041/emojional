import { createTRPCRouter } from  '../trpc';
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from 'zod';
import { privateProcedure, publicProcedure } from '../trpc';
import {type Reply} from '@prisma/client';
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
// You can create a new function to add user data to replies, similar to addUserDataToPosts

const addUserDataToReplies = async (replies: Reply[])=>{
  const users = (
    await clerkClient.users.getUserList({
    userId: replies.map((reply) => reply.authorId),
    limit: 100,
})).map(filterUserForClient);

console.log(users)

return replies.map((reply)=>{
    const author = users.find((user)=> user.id === reply.authorId);

    if(!author || !author.username) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR'});

    return{
    reply,
    author:{
      ...author,
      username: author.username,
    },
};
});
}

export const repliesRouter = createTRPCRouter({
  // Get all replies for a specific post
  getRepliesByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const replies = await ctx.prisma.reply.findMany({
        where: { postId: input.postId },
        orderBy: [{ createdAt: 'desc' }],
        take: 100,
      });

      return addUserDataToReplies(replies);
    }),

  // Create a new reply for a specific post
  createReply: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const reply = await ctx.prisma.reply.create({
        data: {
          authorId,
          postId: input.postId,
          content: input.content,
        },
      });

      return reply;
    }),
});