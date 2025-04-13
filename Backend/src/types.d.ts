import { PrismaClient } from "@prisma/client/edge";
import { Context } from "hono";

export type signContext = Context<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        prisma : PrismaClient,
        userId : string
    }

}>