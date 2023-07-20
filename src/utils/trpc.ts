import { AppRouter } from "@/app/api/trpc/routers/root";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
