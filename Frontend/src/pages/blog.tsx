import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

interface Blog {
  id: string
  title: string
  content: string
  tags: string[]
  authId: string
  published: boolean
  createdAt: string
}

export default function BlogPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://backend.krutarthpipaliya90.workers.dev/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("Authorization")}`,
            },
          }
        )
        setBlog(response.data.post)
      } catch (err) {
        setError("Failed to fetch blog.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (loading) {
    return <div className="text-center mt-20 text-purple-600 text-xl font-bold">Loading blog...</div>
  }

  if (error || !blog) {
    return <div className="text-center mt-20 text-red-500 text-xl font-bold">{error}</div>
  }

  return (
    <div className="min-h-screen px-4 py-10 md:px-12 lg:px-24" style={{ background: "linear-gradient(135deg, #E6E0DA 0%, #F5F2EF 100%)" }}>
      <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl mx-auto border" style={{ borderColor: "#F3F4F6" }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#502D55" }}>
          {blog.title}
        </h1>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: "#F3F4F6", color: "#8E4B71" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="whitespace-pre-wrap leading-relaxed text-lg" style={{ color: "#8E4B71" }}>
          {blog.content}
        </div>
      </div>
    </div>
  )
}
