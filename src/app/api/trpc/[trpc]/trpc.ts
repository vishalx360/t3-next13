import { prisma } from "@/utils/db";
import { TRPCError, initTRPC } from "@trpc/server";
import {
    FetchCreateContextFnOptions
} from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { options } from "../../auth/[...nextauth]/options";


export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
    const session = await getServerSession(options);
    return {
        session,
        prisma,
    };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
