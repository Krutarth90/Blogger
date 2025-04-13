import { Next } from "hono";
import { signContext } from "../types";
import { hash } from "bcryptjs";

export default async function signup (c : signContext, next : Next) {
    const Prisma = c.get("prisma");
    const body = await c.req.json();
    try {
        const findDuplicate = await Prisma.user.findUnique({
            where : {
                email : body.email,
            }
        });
        if(findDuplicate)
        {
            return c.json({
                msg : " EMAIL ALREADY THERE "
            });
        }
        const newPass = await hash(body.password, 10);
        await Prisma.user.create({
            data : {
                name : body.name,
                email : body.email,
                password : newPass
            }
        })
        return c.json({
            msg : " Signed UP Succesfully. "
        });
    }
    catch (e) {
        return c.json({
            Error : e
        });
    }    
}