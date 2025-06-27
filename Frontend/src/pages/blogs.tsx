import { postType } from "@d0om/blogger-common";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blogs() {
  const [posts, setPosts] = useState<(postType & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://backend.krutarthpipaliya90.workers.dev/api/v1/bulk", {
        params: {
          page,
          limit,
        },
      })
      .then((res) => {
        const fetchedPosts = res?.data?.posts;
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
        setLoading(false);
      });
  }, [page]);

  const SkeletonCard = () => (
    <div className="animate-pulse flex flex-col space-y-4 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex items-center gap-4 mt-4">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[#E6E0DA] to-[#F5F2EF] min-h-screen">
      <main className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <h2 className="text-5xl font-extrabold text-[#502D55] tracking-tight">
              Discover Fresh Perspectives
            </h2>
            <p className="mt-4 text-lg text-[#8E4B71]">
              Explore thought-provoking ideas, creative inspiration, and expert tips from bloggers around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
              : posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white border border-gray-100 hover:border-[#8E4B71] hover:shadow-lg p-6 rounded-2xl transition-all duration-300 ease-in-out flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-[#502D55] hover:text-[#7C3AED] transition-colors">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>

                      <p className="mt-3 text-sm text-[#8E4B71] line-clamp-3">
                        {post.content}
                      </p>

                      {/* ✅ Tags Section */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#8E4B71]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.authId}`}
                        alt="avatar"
                        className="h-10 w-10 rounded-full bg-gray-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#502D55]">{post.authId}</p>
                        <p className="text-xs text-[#8E4B71]">Blogger</p>
                      </div>
                    </div>
                  </article>
                ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-12 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-[#502D55] border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-semibold text-[#502D55]">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={posts.length < limit}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                posts.length < limit
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-[#502D55] border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
