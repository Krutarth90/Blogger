import { Hono } from 'hono'
import prismaMake from './middlewares/prismaMake';
import signup from './functions/signup';
import signIn from './functions/signin';
import auth from './middlewares/auth';
import { PrismaClient } from '@prisma/client/extension';
import { newHono } from './types';
import { postSchema, updatePost } from '@d0om/blogger-common';

const app = new Hono<newHono>();

app.post('/api/v1/signup', prismaMake, signup);

app.post('/api/v1/signin', prismaMake, signIn);

app.post('/api/v1/blog', auth, prismaMake, async (c)=>{
    const body = await c.req.json();
    const authId = c.get('userId');
    body.authId = authId;
    const {success, error} =  postSchema.safeParse(body);
    if(!success)
        return c.json({
            Error : error.format()
        }, 400);
    const prisma = c.get('prisma');
    
    try 
    {
        const post = await prisma.post.create({
            data : body
        });
        return c.json({
            id : post.id
        });
    }
    catch(e)
    {
        console.log(e);
        return c.json({
            msg : " ERROR "
        });
        
    }
});

app.put('/api/v1/blog', auth, prismaMake, async (c)=>{
    const body = await c.req.json();
    const prisma = c.get('prisma');
    const authId = c.get('userId');
    
    const {success, error} = updatePost.safeParse(body);
    if(!success)
        return c.json({
            Error : error.format()
        }, 400)
    body.authId = authId;
    try 
    {
        const post = await prisma.post.update({
            where : {
                id : body.id,
                authId : body.authId
            },
            data : {
                title : body.title,
                content : body.content
            }
        });
        return c.json({
            id : post.id
        });
    }
    catch(e)
    {
        console.log(e);
        return c.json({
            msg : " ERROR "
        });
        
    }
});

app.get('/api/v1/blog/:id', auth, prismaMake, async (c)=>{
    const id = c.req.param("id");
    const prisma = c.get('prisma');
    try {
        const post = await prisma.post.findFirst({
            where : {
                id
            }
        });
        return c.json({
            post
        });
    } catch (e) {
        console.log(e);
        c.json({
            message : " ERROR "
        });
    }
});

app.get('/api/v1/bulk', prismaMake, async (c)=>{
    const prisma = c.get('prisma');
    try {
        const posts = await prisma.post.findMany();
        console.log(posts);
        return c.json({
            posts
        });
    } catch (e) {
        console.log(e);
        return c.json({
            message : " ERROR "
        });
    } 
})
export default app
