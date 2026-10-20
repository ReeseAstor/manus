import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

type PublicTrpcShape = {
  message: string;
  code: number;
  data: {
    code: string;
    httpStatus: number;
    path?: string;
    stack?: string;
    [key: string]: unknown;
  };
};

/** Drop bound query parameters before they reach production logs. */
export function redactQueryParams(value: string): string {
  return value.replace(/\nparams:[\s\S]*$/, "\nparams: [redacted]");
}

/** Hide database text on production 500s. Other codes stay specific. */
export function publicTrpcErrorShape(
  shape: PublicTrpcShape,
  error: { code: string; message: string; cause?: unknown },
): PublicTrpcShape {
  if (process.env.NODE_ENV === "production" && error.code === "INTERNAL_SERVER_ERROR") {
    console.error("[tRPC]", shape.data.path ?? "", redactQueryParams(error.message));
    if (error.cause !== undefined) {
      const causeText = error.cause instanceof Error ? error.cause.message : String(error.cause);
      console.error("[tRPC] cause", redactQueryParams(causeText));
    }
    return {
      ...shape,
      message: "Something went wrong.",
      data: {
        ...shape.data,
        stack: undefined,
      },
    };
  }
  return shape;
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return publicTrpcErrorShape(shape, error);
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
