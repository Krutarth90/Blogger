import { compare } from "bcryptjs";
import { signContext } from "../types";
import { sign } from "hono/utils/jwt/jwt";

export default async function signIn(c : signContext){
    const body = await c.req.json();
    const Prisma = c.get("prisma");
    try {
        const user = await Prisma.user.findFirst({
            where : {
                email : body.email
            }
        });
        if(!user){
            return c.json({
                msg : " Email not registered "
            })
        }
        const isValid = await compare(body.password, user.password);
        if(!isValid)
        {
            return c.json({
                msg : " Wrong Password "
            })
        }
        const token = await sign({id : user.id}, c.env.JWT_SECRET);
        return c.json({
            token
        });
    } catch (error) {
        return c.json({
            error
        });
    }
}