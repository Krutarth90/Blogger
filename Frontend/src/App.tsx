import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signup } from './pages/signup';
import { SignIn } from './pages/Signin';
import Blogs from './pages/blogs';
import Blog from './pages/blog';
import CreateBlog from './pages/createBlog';

function App() {
  return(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/signin' element={<SignIn/>}/>
                <Route path='/' element={<Blogs/>}/>
                <Route path='/blog/:id' element = {<Blog/>}/>
                <Route path='/create' element = {<CreateBlog/>}/>
            </Routes>
        </BrowserRouter>
    </div> 
  )
}

export default App;
