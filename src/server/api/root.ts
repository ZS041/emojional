import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "~/server/api/routers/posts";
import { profileRouter } from "./routers/profile";
import { repliesRouter } from "./routers/replies";
import {likesRouter} from "./routers/likes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  
  posts: postsRouter,
  profile: profileRouter,
  replies: repliesRouter,
  likes: likesRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
