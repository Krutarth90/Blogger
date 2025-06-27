"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { useRecoilState, useRecoilValue } from "recoil"
import { blogIdAtom, contentAtom, loggedInSelector, tagsAtom, titleAtom } from "../store/atoms.ts"
import { useNavigate } from "react-router-dom"




interface BlogData {
  id : string
  title: string
  content: string
  tags: string[]
}

export default function EditBlog() {
const [title, setTitle] = useRecoilState(titleAtom);
const [content, setContent] = useRecoilState(contentAtom);
const [tags, setTags] = useRecoilState(tagsAtom);
const id = useRecoilValue(blogIdAtom);
const navigate = useNavigate();
const blogData: BlogData = {
  id,
  title,
  content,
  tags,
};

  const loggedInAuthor = useRecoilValue(loggedInSelector);
  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("write")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field === "title") {
      setTitle(value);
    } else if (field === "content") {
      setContent(value);
    }
  };


  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  
  const editBlog = async () => {
    if (!blogData.title.trim() || !blogData.content.trim()) {
      alert("Please fill in title and content before Editing")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.put(
        "https://backend.krutarthpipaliya90.workers.dev/api/v1/blog", 
        {
          id : blogData.id,
          title: blogData.title,
          content: blogData.content,
          published : true,
          tags: blogData.tags,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        },
      )

      alert("Blog edited successfully!")
      
      navigate('/profile');
      
    } catch (error) {
      console.error("Error Editing blog:", error)
      alert("Failed to Edit blog. Please try again.")
    } finally {
      setIsLoading(false)
      
    }

  }

  const PreviewContent = () => (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#502D55" }}>
        {blogData.title || "Untitled Blog Post"}
      </h1>

      {loggedInAuthor.name && (
        <div className="mb-6">
          <p className="font-semibold" style={{ color: "#502D55" }}>
            {loggedInAuthor.name}
          </p>
        </div>
      )}

      {blogData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blogData.tags.map((tag, index) => (
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

      <div className="whitespace-pre-wrap leading-relaxed" style={{ color: "#8E4B71" }}>
        {blogData.content || "Start writing your blog content..."}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #E6E0DA 0%, #F5F2EF 100%)" }}>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#502D55" }}>
            Write Your Story
          </h2>
          <p className="mt-2" style={{ color: "#8E4B71" }}>
            Share your thoughts with the world
          </p>
          <div className="flex items-center gap-2 text-sm mt-2" style={{ color: "#8E4B71" }}>
            <span>Writing as:</span>
            <span className="font-medium" style={{ color: "#7C3AED" }}>
              {loggedInAuthor.name}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b relative" style={{ borderColor: "#F3F4F6" }}>
            <nav className="flex space-x-8 relative">
              <button
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-2 py-2 px-1 text-sm transition-all duration-300 ease-in-out font-extrabold relative z-10 ${
                  activeTab === "write" ? "text-purple-600" : "hover:text-gray-600"
                }`}
                style={{
                  color: activeTab === "write" ? "#7C3AED" : "#8E4B71",
                }}
              >
                <span>✏️</span>
                Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 py-2 px-1 text-sm transition-all duration-300 ease-in-out font-extrabold relative z-10 ${
                  activeTab === "preview" ? "text-purple-600" : "hover:text-gray-600"
                }`}
                style={{
                  color: activeTab === "preview" ? "#7C3AED" : "#8E4B71",
                }}
              >
                <span>👁️</span>
                Preview
              </button>
            </nav>
          </div>

          {/* Content Container with smooth transitions */}
          <div className="relative overflow-hidden">
            {/* Write Tab Content */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "write"
                  ? "opacity-100 translate-x-0 relative"
                  : "opacity-0 translate-x-[-100%] absolute top-0 left-0 w-full pointer-events-none"
              }`}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div
                      className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 hover:border-opacity-100"
                      style={{
                        borderColor: "#F3F4F6",
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = "#8E4B71"
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = "#F3F4F6"
                      }}
                    >
                      <div className="px-6 py-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <h3 className="text-lg font-semibold" style={{ color: "#502D55" }}>
                          Blog Content
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#502D55" }}
                          >
                            Title *
                          </label>
                          <input
                            id="title"
                            type="text"
                            placeholder="Enter your blog title..."
                            value={blogData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className="w-full px-3 py-2 text-lg font-semibold border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white"
                            style={{
                              borderColor: "#F3F4F6",
                              color: "#502D55",
                            }}
                            onFocus={(e) => {
                              ;(e.target as HTMLInputElement).style.borderColor = "#7C3AED"
                              ;(e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.2)"
                            }}
                            onBlur={(e) => {
                              ;(e.target as HTMLInputElement).style.borderColor = "#F3F4F6"
                              ;(e.target as HTMLInputElement).style.boxShadow = "none"
                            }}
                            onMouseEnter={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLInputElement).style.borderColor = "#8E4B71"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLInputElement).style.borderColor = "#F3F4F6"
                              }
                            }}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="content"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#502D55" }}
                          >
                            Content *
                          </label>
                          <textarea
                            id="content"
                            placeholder="Start writing your blog content here..."
                            value={blogData.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            rows={20}
                            className="w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 resize-none bg-white"
                            style={{
                              borderColor: "#F3F4F6",
                              color: "#502D55",
                            }}
                            onFocus={(e) => {
                              ;(e.target as HTMLTextAreaElement).style.borderColor = "#7C3AED"
                              ;(e.target as HTMLTextAreaElement).style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.2)"
                            }}
                            onBlur={(e) => {
                              ;(e.target as HTMLTextAreaElement).style.borderColor = "#F3F4F6"
                              ;(e.target as HTMLTextAreaElement).style.boxShadow = "none"
                            }}
                            onMouseEnter={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLTextAreaElement).style.borderColor = "#8E4B71"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLTextAreaElement).style.borderColor = "#F3F4F6"
                              }
                            }}
                          />
                          <p className="text-sm mt-2" style={{ color: "#8E4B71" }}>
                            {blogData.content.trim().split(/\s+/).length} words
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Tags */}
                    <div
                      className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300"
                      style={{ borderColor: "#F3F4F6" }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = "#8E4B71"
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = "#F3F4F6"
                      }}
                    >
                      <div className="px-6 py-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#502D55" }}>
                          <span style={{ color: "#7C3AED" }}>#</span>
                          Tags
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white"
                            style={{
                              borderColor: "#F3F4F6",
                              color: "#502D55",
                            }}
                            onFocus={(e) => {
                              ;(e.target as HTMLInputElement).style.borderColor = "#7C3AED"
                              ;(e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.2)"
                            }}
                            onBlur={(e) => {
                              ;(e.target as HTMLInputElement).style.borderColor = "#F3F4F6"
                              ;(e.target as HTMLInputElement).style.boxShadow = "none"
                            }}
                            onMouseEnter={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLInputElement).style.borderColor = "#8E4B71"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (e.target !== document.activeElement) {
                                ;(e.target as HTMLInputElement).style.borderColor = "#F3F4F6"
                              }
                            }}
                          />
                          <button
                            onClick={addTag}
                            className="px-4 py-2 text-white text-sm font-medium rounded-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{
                              backgroundColor: "#7C3AED",
                              boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
                            }}
                            onMouseEnter={(e) => {
                              ;(e.target as HTMLButtonElement).style.backgroundColor = "#6D28D9"
                            }}
                            onMouseLeave={(e) => {
                              ;(e.target as HTMLButtonElement).style.backgroundColor = "#7C3AED"
                            }}
                          >
                            Add
                          </button>
                        </div>
                        {blogData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blogData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer"
                                style={{
                                  backgroundColor: "#F3F4F6",
                                  color: "#8E4B71",
                                }}
                                onMouseEnter={(e) => {
                                  ;(e.target as HTMLSpanElement).style.backgroundColor = "#E5E7EB"
                                }}
                                onMouseLeave={(e) => {
                                  ;(e.target as HTMLSpanElement).style.backgroundColor = "#F3F4F6"
                                }}
                              >
                                {tag}
                                <span
                                  className="cursor-pointer hover:text-red-500 transition-colors duration-200 font-bold"
                                  onClick={() => removeTag(tag)}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t" style={{ borderColor: "#F3F4F6" }}>
                  <button
                    onClick={() => {
                        navigate('/profile');
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      borderColor: "#F3F4F6",
                      color: "#502D55",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        ;(e.target as HTMLButtonElement).style.backgroundColor = "#F9FAFB"
                        ;(e.target as HTMLButtonElement).style.borderColor = "#8E4B71"
                      }
                    }}
                    onMouseLeave={(e) => {
                      ;(e.target as HTMLButtonElement).style.backgroundColor = "white"
                      ;(e.target as HTMLButtonElement).style.borderColor = "#F3F4F6"
                    }}
                  >
                    <span></span>
                    {isLoading ? "Canceling..." : "Cancel Changes"}
                  </button>
                  <button
                    onClick={editBlog}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-md hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      backgroundColor: "#7C3AED",
                      boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        ;(e.target as HTMLButtonElement).style.backgroundColor = "#6D28D9"
                      }
                    }}
                    onMouseLeave={(e) => {
                      ;(e.target as HTMLButtonElement).style.backgroundColor = "#7C3AED"
                    }}
                  >
                    <span>🚀</span>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Tab Content */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "preview"
                  ? "opacity-100 translate-x-0 relative"
                  : "opacity-0 translate-x-[100%] absolute top-0 left-0 w-full pointer-events-none"
              }`}
            >
              <div
                className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: "#F3F4F6" }}
              >
                <div className="p-8">
                  <PreviewContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
