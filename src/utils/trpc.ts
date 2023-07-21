import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "@/app/api/trpc/routers/root";

export const trpc = createTRPCReact<AppRouter>();
