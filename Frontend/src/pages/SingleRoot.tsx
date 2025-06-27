import { useRecoilValue } from "recoil"
import { pathAtom } from "../store/atoms"
import Blogs from "./blogs";
import CreateBlog from "./createBlog";
import Profile from "./Profile";
import { SignIn } from "./Signin";
import { Signup } from "./signup";
import EditBlog from "./Edit";

export function SingleRoot () {

    const path = useRecoilValue(pathAtom);

    switch(path)
    {
        case 'blogs':
            return <Blogs/>;
        
        case 'create':
            return <CreateBlog />;   
        
        case 'profile':
            return <Profile />;

        case 'signin' :
            return <SignIn />;
        
        case 'signup' :
            return <Signup />;
        
        case 'edit' :
            return <EditBlog />;
    }
}