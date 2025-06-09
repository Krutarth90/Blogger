import { postType } from "@d0om/blogger-common";
import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Blogs() {
    const [posts, setPosts] = useState<(postType & {id : string})[]>([]);
    useEffect(()=> {
        axios.get('https://backend.krutarthpipaliya90.workers.dev/api/v1/bulk')
            .then((res)=>{
                setPosts(res.data.posts);
            });
        
    }, [])
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">From the blog</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">Learn how to grow your business with our expert advice.</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map((post) => (
                        <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                        <div className="group relative">
                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                            <Link to = {`/blog/${post.id}`}>
                                <span className="absolute inset-0" />
                                {post.title}
                            </Link>
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.content}</p>
                        </div>
                        <div className="relative mt-8 flex items-center gap-x-4">
                            <img alt="" src="https://images.app.goo.gl/ZRN9tNPGVqeuV7bNA" className="size-10 rounded-full bg-gray-50" />
                            <div className="text-sm/6">
                            <p className="font-semibold text-gray-900">
                                <a href="NO">
                                <span className="absolute inset-0" />
                                {post.authId}
                                </a>
                            </p>
                            <p className="text-gray-600">"NOrmie"</p>
                            </div>
                        </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}