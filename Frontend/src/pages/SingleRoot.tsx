import { useRecoilValue } from "recoil"
import { pathAtom } from "../store/atoms"
import Blogs from "./blogs";
import CreateBlog from "./createBlog";
import Profile from "./Profile";

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
    }
}