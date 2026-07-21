import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../server/router";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

export async function listStations(search?: string) {
  return trpcClient.getStations.query({ search });
}