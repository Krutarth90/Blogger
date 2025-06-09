import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Blog(){

    const { id } = useParams();
    const [blog, setBLog] = useState({
        title : "",
        content : ""
    });
    console.log(id);
    useEffect(()=>{
        axios.get('https://backend.krutarthpipaliya90.workers.dev/api/v1/blog/' + id, {
            headers : {
                Authorization : localStorage.getItem("Authorization")
            }
        })
        .then((res)=>{
            console.log("Blog data set:", res.data.post);
            setBLog(res.data.post);
            
        })
    }, []);

    return (
        <div>
            <div>
                {blog.title}
            </div>
            <div>
                {blog.content}
            </div>
        </div>
    )
}