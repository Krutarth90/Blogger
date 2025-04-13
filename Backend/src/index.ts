import { Hono } from 'hono'
import prismaMake from './middlewares/prismaMake';
import signup from './functions/signup';
import signIn from './functions/signin';

const app = new Hono();

app.post('/api/v1/signup', prismaMake, signup);

app.post('/api/v1/signin', prismaMake, signIn);

// app.post('/api/v1/blog', (c)=>{

// });

// app.put('/api/v1/blog', (c)=>{

// });

// app.get('/api/v1/blog/;id', (c)=>{

// });
export default app
