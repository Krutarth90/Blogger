"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { blogIdAtom, contentAtom, loggedInSelector, tagsAtom, titleAtom } from "../store/atoms"
import { Link, useNavigate } from "react-router-dom"


type Post = {
  id: string
  title: string
  content: string
  published: boolean
  tags :[string]
}

export default function Profile() {
  const user = useRecoilValue(loggedInSelector)
  const [publishedBlogs, setPublishedBlogs] = useState<Post[]>([])
  const [draftBlogs, setDraftBlogs] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published")
  const setTitle = useSetRecoilState(titleAtom);
  const setContent = useSetRecoilState(contentAtom);
  const setTags = useSetRecoilState(tagsAtom);
  const setBlogId = useSetRecoilState(blogIdAtom);
  const navigate = useNavigate();
  const fetchUserBlogs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("Authorization")
      const res = await axios.get("https://backend.krutarthpipaliya90.workers.dev/api/v1/myblogs", {
        headers: {
          Authorization: token,
        },
      })
      const blogs: Post[] = res.data || []
      setPublishedBlogs(blogs.filter((b) => b.published))
      setDraftBlogs(blogs.filter((b) => !b.published))
    } catch (err) {
      console.error("Error fetching user blogs", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this blog?")) return;

  try {
    setDeletingId(id);
    await axios.delete("https://backend.krutarthpipaliya90.workers.dev/api/v1/blog/delete", {
      headers: {
        Authorization: localStorage.getItem("Authorization") || "",
        "Content-Type": "application/json"
      },
      data: {
        id
      }
    });

    alert("Blog deleted successfully!");
    // optionally refresh or remove the blog from state

      // Animate removal
      setTimeout(() => {
        fetchUserBlogs()
        setDeletingId(null)
      }, 300)
    } catch (err) {
      console.error("Error deleting blog", err)
      setDeletingId(null)
    }
  }

  const publishDraft = async (post: Post) => {
    try {
      setPublishingId(post.id)
      await axios.put(
        `https://backend.krutarthpipaliya90.workers.dev/api/v1/blog`, { 
          id : post.id,
          published: true,
          title : post.title,
          content : post.content,
          tags : post.tags 
        },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        },
      )

      // Animate transition
      setTimeout(() => {
        fetchUserBlogs()
        setPublishingId(null)
      }, 500)
    } catch (err) {
      console.error("Error publishing blog", err)
      setPublishingId(null)
    }
  }

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  useEffect(() => {
    if (user.email) fetchUserBlogs()
  }, [user.email])

  const currentBlogs = activeTab === "published" ? publishedBlogs : draftBlogs

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header with fade-in animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Welcome back, {user.name || "Writer"}! 👋</h1>
          <p className="text-lg text-purple-700">Manage your published posts and drafts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedBlogs.length}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{draftBlogs.length}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-purple-600">{publishedBlogs.length + draftBlogs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="border-b border-gray-200 relative">
            <nav className="flex space-x-8 relative">
              {/* Sliding indicator */}
              <div
                className={`absolute bottom-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out rounded-full ${
                  activeTab === "published" ? "w-20 left-0" : "w-16 left-28"
                }`}
              />

              <button
                onClick={() => setActiveTab("published")}
                className={`flex items-center gap-2 py-3 px-1 text-sm transition-all duration-300 ease-in-out font-semibold relative z-10 transform hover:scale-105 ${
                  activeTab === "published" ? "text-purple-600" : "text-purple-700 hover:text-purple-600"
                }`}
              >
                <span className="text-lg">🚀</span>
                Published ({publishedBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`flex items-center gap-2 py-3 px-1 text-sm transition-all duration-300 ease-in-out font-semibold relative z-10 transform hover:scale-105 ${
                  activeTab === "drafts" ? "text-purple-600" : "text-purple-700 hover:text-purple-600"
                }`}
              >
                <span className="text-lg">📝</span>
                Drafts ({draftBlogs.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-purple-700 animate-pulse">Loading your blogs...</p>
            </div>
          </div>
        ) : (
          /* Blog Posts */
          <div className="space-y-6">
            {currentBlogs.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">{activeTab === "published" ? "📝" : "💾"}</div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">No {activeTab} yet</h3>
                <p className="text-purple-700 mb-6">
                  {activeTab === "published"
                    ? "You haven't published any blogs yet. Start writing to share your thoughts!"
                    : "No drafts available. Create a new post to get started!"}
                </p>
                <div
                  onClick={()=>{
                    setTitle('');
                    setContent('');
                    setTags([]);
                    navigate('/create');
                  }}

                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">✏️</span>
                  Write New Post
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {currentBlogs.map((post, index) => (
                  <div
                    key={post.id}
                    className={`bg-white rounded-xl shadow-lg border border-purple-100 p-6 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-slide-up ${
                      deletingId === post.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    } ${publishingId === post.id ? "animate-pulse bg-green-50 border-green-200" : ""}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {activeTab === "published" ? (
                          <Link to={`/blog/${post.id}`} className="group">
                            <h3 className="text-xl font-semibold text-purple-900 group-hover:text-purple-600 transition-colors duration-300 mb-2">
                              {post.title}
                              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                                →
                              </span>
                            </h3>
                            <p className="text-gray-600 line-clamp-2 leading-relaxed">
                              {truncateContent(post.content)}
                            </p>
                          </Link>
                        ) : (
                          <div>
                            <h3 className="text-xl font-semibold text-purple-900 mb-2">{post.title}</h3>
                            <p className="text-gray-600 line-clamp-2 leading-relaxed">
                              {truncateContent(post.content)}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.published ? "🚀 Published" : "📝 Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                        {!post.published && (
                          <button
                            onClick={() => publishDraft(post)}
                            disabled={publishingId === post.id}
                            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {publishingId === post.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                Publishing...
                              </>
                            ) : (
                              <>
                                <span className="mr-2">📢</span>
                                Publish
                              </>
                            )}
                          </button>
                        )}

                        <div
                          onClick={()=>{

                            setTitle(post.title);
                            setContent(post.content);
                            setTags(post.tags);
                            setBlogId(post.id);
                            navigate('/edit');
                          }}
                          className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transform hover:scale-105 transition-all duration-300"
                        >
                          <span className="mr-2">🖊️</span>
                          Edit
                        </div>

                        <button
                          onClick={() => deleteBlog(post.id)}
                          disabled={deletingId === post.id}
                          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === post.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <span className="mr-2">🗑️</span>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
            opacity: 0;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `,
        }}
      />
    </div>
  )
}
