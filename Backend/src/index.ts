import { Hono } from 'hono'
import prismaMake from './middlewares/prismaMake';
import signup from './functions/signup';
import signIn from './functions/signin';
import auth from './middlewares/auth';
import { newHono } from './types';
import { postSchema, updatePost } from '@d0om/blogger-common';

const app = new Hono<newHono>();

app.use('*', async (c, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://blogger-topaz-six.vercel.app'];
  const origin = c.req.header('Origin');

  if (origin && allowedOrigins.includes(origin)) {
    c.res.headers.set('Access-Control-Allow-Origin', origin);
  }

  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.res.headers.set('Access-Control-Allow-Credentials', 'true');

  return next();
});

app.options('*', (c) => {
  const allowedOrigins = ['http://localhost:5173', 'https://blogger-topaz-six.vercel.app'];
  const origin = c.req.header('Origin');

  if (origin && allowedOrigins.includes(origin)) {
    c.res.headers.set('Access-Control-Allow-Origin', origin);
  }

  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.res.headers.set('Access-Control-Allow-Credentials', 'true');

  return c.json({}, 200);
});



app.get('/api/v1/user', prismaMake, auth, async (c)=>{
    const prisma = c.get('prisma');
    const id = c.get('userId');
    try {
        const user = await prisma.user.findFirst({
            where : {
                id
            }
        });
        if(user)
            user.password = "ITSSSECRET";
        return c.json(user);
    } catch (error) {
        return c.json({
            message : error
        });
    }
});

app.get('/api/v1/myblogs', prismaMake, auth, async (c)=>{
    const prisma = c.get('prisma');
    const id = c.get('userId');
    try {
        const posts = await prisma.post.findMany({
            where : {
                authId : id
            }
        });
        return c.json(posts);
    } catch (error) {
        return c.json({
            message : error
        });
    }
});
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
                content : body.content,
                tags : body.tags,
                published : body.published
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


app.delete('/api/v1/blog/delete', auth, prismaMake, async (c) => {
  try {
    const authId = c.get('userId');
    const prisma = c.get('prisma');
    const body = await c.req.json();

    if (!body.id || !authId) {
      return c.json({ message: "Missing required fields" }, 400);
    }

    const post = await prisma.post.findUnique({
      where: { id: body.id }
    });

    if (!post || post.authId !== authId) {
      return c.json({ message: "Unauthorized or blog not found" }, 403);
    }

    const deleted = await prisma.post.delete({
      where: { id: body.id }
    });

    return c.json({ post: deleted });
  } catch (e) {
    console.error("Error deleting blog:", e);
    return c.json({ message: "Failed to delete blog" }, 500);
  }
});


app.get('/api/v1/bulk', prismaMake, async (c)=>{
    const prisma = c.get('prisma');
    const pageNumber = +(c.req.query("page") || 1);
    const limit = +(c.req.query("limit") || 12);
    try {
        const posts = await prisma.post.findMany({
            where : {
                published : true
            },
            skip : (pageNumber - 1) * limit,
            take : limit
        });
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
