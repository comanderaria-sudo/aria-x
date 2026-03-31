import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserFindings } from "./db";
import { createCheckoutSession } from "./stripe-service";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agent: router({
    runCycle: protectedProcedure.mutation(async ({ ctx }) => {
      const { createAgent } = await import("./agent-loop");
      const agent = createAgent(ctx.user.id, true);
      return agent.runFullCycle();
    }),

    getFindings: protectedProcedure.query(async ({ ctx }) => {
      return getUserFindings(ctx.user.id);
    }),

    approveFinding: protectedProcedure
      .input((val: unknown) => ({
        findingId: (val as any)?.findingId as string,
        approved: (val as any)?.approved as boolean,
        feedback: (val as any)?.feedback as string | undefined,
      }))
      .mutation(async ({ ctx, input }) => {
        const { createAgent } = await import("./agent-loop");
        const agent = createAgent(ctx.user.id, false);
        return agent.approve(input.findingId, input.approved, input.feedback);
      }),

    executeFinding: protectedProcedure
      .input((val: unknown) => ({
        findingId: (val as any)?.findingId as string,
      }))
      .mutation(async ({ ctx, input }) => {
        const { createAgent } = await import("./agent-loop");
        const agent = createAgent(ctx.user.id, false);
        return agent.execute(input.findingId);
      }),
  }),

  stripe: router({
    checkout: publicProcedure
      .input((val: unknown) => ({
        email: (val as any)?.email as string,
      }))
      .mutation(async ({ input, ctx }) => {
        const protocol = ctx.req.protocol || 'https';
        const host = ctx.req.headers.host || 'localhost:3000';
        const returnUrl = `${protocol}://${host}/dashboard`;
        const session = await createCheckoutSession(input.email, returnUrl);
        return { url: session.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
