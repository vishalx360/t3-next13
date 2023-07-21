import { z } from "zod";

export const addTodoSchema = z.object({
  title: z.string().min(1).max(100),
});

export type addTodoSchema = z.infer<typeof addTodoSchema>;
