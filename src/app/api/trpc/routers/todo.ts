import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../[trpc]/trpc";


export const TodoRouter = createTRPCRouter({
  // CREATE
  addTodo: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id
        }
      });
    }),

  // READ 
  getTodos: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.todo.findMany({
        where: {
          userId: ctx.session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }),

  // UPDATE
  updateTodo: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          completed: input.completed
        }
      });
    }),

  // DELETE
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({ where: { id: input.id } });
    }),
})




