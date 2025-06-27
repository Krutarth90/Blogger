import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout" // the layout you just created
import Blogs from "./pages/blogs"
import CreateBlog from "./pages/createBlog"
import EditBlog from "./pages/Edit"
import { Signup } from "./pages/signup"
import { SignIn } from "./pages/Signin"
import Profile from "./pages/Profile"
import ViewBlog from "./pages/blog"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use Topbar layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Blogs />} />
          <Route path="create" element={<CreateBlog />} />
          <Route path="profile" element={<Profile />} />
          <Route path="blog/:id" element={<ViewBlog />} />
          <Route path="edit" element={<EditBlog />} />
        </Route>

        {/* Routes that do NOT use Topbar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
