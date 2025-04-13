import { verify } from "hono/jwt";
import { signContext } from "../types";
import { Next } from "hono";

export default async function auth(c : signContext, next : Next) {
    const bearer = c.req.header("authorization");
    if(!bearer || !(bearer.startsWith("Bearer")))
        return c.json({
            msg : "invalid token"
        });
    const token = bearer.split(' ')[1];
    if(!token)
        return c.json({
            msg : "invalid token"
        });
    
    try {
        const decoded = await verify(token, c.env.JWT_SECRET);
        if(typeof(decoded.id) == "string")
            c.set('userId', decoded.id);
        return await next();

    } catch (error) {
       console.log("Error " + error); 
    }
}