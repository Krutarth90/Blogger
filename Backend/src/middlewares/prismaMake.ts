import { Next } from "hono";
import { signContext } from "../types";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export default async function prismaMake (c : signContext, next : Next){
    const Prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    c.set('prisma', Prisma);
    await next();
}