import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

const prismaINstance = (new PrismaClient().$extends(withAccelerate()));

export type signContext = Context<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        prisma : typeof prismaINstance,
        userId : string
    }
}>

export type newHono = {
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        prisma : typeof prismaINstance,
        userId : string
    }
}