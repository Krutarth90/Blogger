import { Next } from "hono";
import { signContext } from "../types";
import { hash } from "bcryptjs";
import { signUpSchema } from "@d0om/blogger-common";

export default async function signup (c : signContext, next : Next) {
    const Prisma = c.get("prisma");
    const body = await c.req.json();
    const {success, error} = signUpSchema.safeParse(body);
    if(!success)
        return c.json({
            Error : error.format()
        }, 400)
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
                name : body.username,
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