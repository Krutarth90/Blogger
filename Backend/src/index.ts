import { Hono } from 'hono'
import prismaMake from './middlewares/prismaMake';
import signup from './functions/signup';
import signIn from './functions/signin';
import auth from './middlewares/auth';
import { PrismaClient } from '@prisma/client/extension';
import { newHono } from './types';

const app = new Hono<newHono>();

app.post('/api/v1/signup', prismaMake, signup);

app.post('/api/v1/signin', prismaMake, signIn);

app.post('/api/v1/blog', auth, prismaMake, async (c)=>{
    const body = await c.req.json();
    const prisma = c.get('prisma');
    const authId = c.get('userId');
    body.authId = authId;
    try 
    {
        const post = await prisma.post.create({
            data : body
        });
        c.json({
            id : post.id
        });
    }
    catch(e)
    {
        c.json({
            msg : " ERROR "
        });
        console.log(e);
    }
});

app.put('/api/v1/blog', auth, prismaMake, async (c)=>{
    const body = await c.req.json();
    const prisma = c.get('prisma');
    const authId = c.get('userId');
    body.authId = authId;
    try 
    {
        const post = await prisma.post.update({
            where : {
                id : body.id,
                authId
            },
            data : {
                title : body.title,
                content : body.content
            }
        });
        c.json({
            id : post.id
        });
    }
    catch(e)
    {
        c.json({
            msg : " ERROR "
        });
        console.log(e);
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
export default app
