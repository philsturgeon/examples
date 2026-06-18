import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";

import { appRouter } from "./router";

const app = express();

app.use("/api/trpc", createExpressMiddleware({ router: appRouter }));
app.use("/api", createOpenApiExpressMiddleware({ router: appRouter })); /* 👈 */

app.listen(3000);
