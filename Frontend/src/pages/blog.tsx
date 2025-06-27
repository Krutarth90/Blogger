import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Blog = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authId: string;
};

export default function ViewBlog() {
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [authorName, setAuthorName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing blog ID in URL.");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("Authorization") || "";
        const res = await axios.get(
          `https://backend.krutarthpipaliya90.workers.dev/api/v1/blog/${id}`,
          { headers: { Authorization: token } }
        );

        const post = res.data.post;
        if (!post) {
          setError("Blog not found.");
          return;
        }

        setBlog(post);

        // Fetch author name
        const authorRes = await axios.get(
          `https://backend.krutarthpipaliya90.workers.dev/api/v1/user/${post.authId}`
        );
        setAuthorName(authorRes.data.name || post.authId);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-[#502D55]">
        Loading blog...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center text-gray-500 text-lg">
        Blog content is not available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#502D55] mb-2">{blog.title}</h1>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {blog.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm bg-[#F3F4F6] text-[#8E4B71] border border-[#E5E7EB] rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${blog.authId}`}
          alt="avatar"
          className="h-12 w-12 rounded-full bg-gray-200"
        />
        <div>
          <p className="text-sm font-semibold text-[#502D55]">{authorName}</p>
          <p className="text-xs text-[#8E4B71]">Author</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose max-w-none text-[#502D55] prose-p:leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  );
}
